#!/usr/bin/env python
#
# interact with the lambda term to do reductions, etc.

import os
import copy
from node import ApplicationNode, AbstractionNode, VariableNode
from parser import parse_expr

macros = {}

DEBUG = False

def debug_set():
	global DEBUG
	DEBUG = True

def debug_clear():
	global DEBUG
	DEBUG = False

def get_all_nodes(tree):
	result = []
	queue = [tree]
	while queue:
		result += queue
		tmp = []
		for node in queue:
			tmp += node.children
		queue = tmp

	return result

def clone_tree(tree):
	nodes = get_all_nodes(tree)
	nodes2new = {}

	# create old->new mapping
	for node in nodes:
		new = None
		if isinstance(node, VariableNode):
			new = VariableNode(node.name)
		elif isinstance(node, AbstractionNode):
			new = AbstractionNode(node.var_name, None)
		elif isinstance(node, ApplicationNode):
			new = ApplicationNode(None, None)
		else:
			assert False
		nodes2new[node] = new

	# remap children, binding references
	for (old, new) in nodes2new.items():
		new.parent = nodes2new.get(old.parent)
		new.depth = old.depth

		if new.degree > 0:
			new.children[0] = nodes2new[old.children[0]]
		if new.degree > 1:
			new.children[1] = nodes2new[old.children[1]]

		if isinstance(old, VariableNode):
			if old.binding in nodes2new:
				new.binding = nodes2new[old.binding]
			else:
				# this points up above the subtree where the clone started
				new.binding = old.binding

	return nodes2new[tree]

# should be called MULTIPLE times: after parsing, and after B-reduction,
# since depths will change
def decorate(ast):
	curid = 0
	depth = 0
	queue = [ast]
	while queue:
		for node in queue:
			node.depth = depth
			node.id = curid
			curid += 1

		tmp = []
		for node in queue:
			tmp += node.children

		queue = tmp
		depth += 1

# have each AbstractionNode point to all its bound VariableNodes
# WARNING! assumes the given ast has had its depths decorated
#
# should be called ONCE after parsing, depth decorating
# (the bindings shouldn't change even during B-reduction)
def decorate_bindings(ast):
	global DEBUG
	for anode in filter(lambda x: isinstance(x, AbstractionNode), get_all_nodes(ast)):
		for vnode in filter(lambda x: isinstance(x, VariableNode) and x.name==anode.var_name, anode.descendents()):
			vnode.binding = anode

def substitute_macros(ast):
	global macros
	result = ast
	for var in [x for x in get_all_nodes(ast) if isinstance(x, VariableNode)]:
		if var.name in macros:
			new = clone_tree(macros[var.name])
			if not var.parent:
				result = new
			else:
				var.parent.update_children(var, new)
				new.parent = var.parent
	return result

def to_tree(expr:str):
	ast = parse_expr(expr)
	#print(ast.str_tree())
	decorate(ast)
	decorate_bindings(ast)
	ast = substitute_macros(ast)
	decorate(ast)
	return ast

# note: macros are NOT lexical, they're tree replacements that happen after parsing and binding
def assign_macro(name:str, expr:str):
	global macros
	macros[name] = to_tree(expr)
	#print('assigned %s to:' % name)
	#print(macros[name].str_tree())

# if reducible -> return the ApplicationNode that will be the target of the next reduce step
#         else -> return None
def reducible(term):
	assert not term is None
	nodes = get_all_nodes(term)
	nodes = [x for x in nodes if isinstance(x, ApplicationNode) and isinstance(x.children[0], AbstractionNode)]
	if not nodes: return None
	nodes = sorted(nodes, key=lambda x: x.depth, reverse=True)
	return nodes[0]

# reduce a term, single-step style
# WARNING! assumes depth and binding decoration is current
def reduce_step(term, target=None):
	if not target:
		target = reducible(term)
	if not target:
		return term

	# substitute all variables bound by abst in body with val:
	#
	#    appl
	#    /  \
	#  abst  val
	#   |
	#  body
	#   |
	#  ...
	#   |
	#  var
	#
	appl = target
	val = appl.children[1] 
	abst = appl.children[0]

	#print('appl: ', appl)
	#print('val: ', val)
	#print('abst: ', abst)

	# replace all bound variables
	for var in filter(lambda x: isinstance(x, VariableNode) and x.binding, abst.descendents()):
		if var.binding == abst:
			substitute = clone_tree(val)
			substitute.parent = var.parent
			var.parent.update_children(var, substitute)

	# replace link to appl with links to body
	body = abst.children[0] # important! body could have been a replaced variable
	if not appl.parent:
		result = body
		body.parent = None
	else:
		appl.parent.update_children(appl, body)
		body.parent = appl.parent
		result = term

	# depths have changed, update
	assert result.parent == None
	decorate(result)
	return result

def reduce_(term:str, target=None):
	term = to_tree(term)

	if not target:
		target = reducible(term)

	step = 0
	while target:
		if DEBUG:
			#print(term.str_tree(target))
			draw_graphviz(term, target, '/tmp/tmp%04d.png' % step)
			step += 1
		term = reduce_step(term, target)
		if DEBUG:
			#print('----')
			draw_graphviz(term, None, '/tmp/tmp%04d.png' % step)
			step += 1
		target = reducible(term)

	if DEBUG:
		#print(term.str_tree())
		draw_graphviz(term, None, '/tmp/tmp%04d.png' % step)
		step += 1

	return term

def equals(a, b):
	if type(a) == str:
		a = to_tree(a)
	if type(b) == str:
		b = to_tree(b)
	return a == b

def draw_graphviz(term, hlnode=None, fname=None):
	if type(term) == str:
		term = to_tree(term)

	#print('gonna draw: ')
	#print(term.str_tree())

	dot = 'digraph g {\n'
	dot += '\tgraph [ordering="out"];'
	
	def node2mark(node):
		if isinstance(node, VariableNode): return '%s' % (node.name)
		elif isinstance(node, AbstractionNode): return '&lambda;.%s' % node.var_name
		else: return '@'

	nodes = get_all_nodes(term)

	# labels
	for node in nodes:
		color = ' color="red"' if node is hlnode else ''
		dot += '\t"obj_%d" [ label = "%s"%s];\n' % (id(node), node2mark(node), color)

	# parent -> child edges
	for node in nodes:
		src = 'obj_%d' % id(node)
		for child in node.children:
			dst = 'obj_%d' % id(child)
			dot += '\t"%s" -> "%s";\n' % (src, dst)

	# child -> parent edges
	for node in nodes:
		if not node.parent: continue
		src = 'obj_%d' % id(node)
		dst = 'obj_%d' % id(node.parent)
		dot += '\t"%s" -> "%s" [color="red"];\n' % (src, dst)

	# variable -> abstraction bindings
	for node in filter(lambda x: isinstance(x, VariableNode) and x.binding, nodes):
		src = 'obj_%d' % id(node)
		dst = 'obj_%d' % id(node.binding)
		dot += '\t"%s" -> "%s" [style=dashed, color="grey"]' % (src, dst)

	dot += '}\n'

	with open('/tmp/tmp.dot', 'w') as fp:
		fp.write(dot)

	if not fname:
		fname = '/tmp/tmp.png'
	print('writing %s' % fname)
	os.system('dot /tmp/tmp.dot -Tpng -o' + fname)

	
