//------------------------------------------------------------------------------
// herbrand.js
//------------------------------------------------------------------------------

var name = 'main';
var proof = makeproof();
proofs['main'] = proof;

// doinitialize
//------------------------------------------------------------------------------

function doinitialize ()
 {proof = archivetoproof(document.getElementsByTagName('proof')[0]);
  showproof(proof)}

 {var proof = seq('proof');
  stepnumber = 0;
  for (var i=1; i<archive.childNodes.length; i++)
      {if (archive.childNodes[i].nodeName==='STEP')
          {stepnumber = stepnumber + 1;
           var step = archivetostep(stepnumber,archive.childNodes[i]);
           proof[proof.length] = step}};
  return proof}

function archivetostep (n,archive)
 {var sentence = getsubnode(archive,'SENTENCE').textContent;
  var justification = getsubnode(archive,'JUSTIFICATION').textContent;
  var step = seq('step',n,read(sentence),justification);
  for (var i=0; i<archive.childNodes.length; i++)
      {if (archive.childNodes[i].nodeName==='ANTECEDENT')
          {step[step.length] = archive.childNodes[i].textContent*1}};
  return step};

function getsubnode (node,tag)
 {for (var i=0; i<node.childNodes.length; i++)
      {if (node.childNodes[i].nodeName===tag) {return node.childNodes[i]}};
  return false}

//------------------------------------------------------------------------------
// showproof
//------------------------------------------------------------------------------

function showproof (proof)
 {var area = document.getElementById('proof');
  var n = area.childNodes.length;
  for (var i=0; i<n; i++) {area.removeChild(area.childNodes[0])};
  area.appendChild(displayproof(proof));
  showsignature();
  showbuttons()}

function displayproof (proof)
  table.setAttribute('width','640');
  table.setAttribute('cellpadding','0');
  table.setAttribute('cellspacing','0');
  table.setAttribute('border','0');
  displayfirst(1,table);
  displaysteps(1,proof,table);
  displayempty(prooflevel(proof),table);
  return table}

function displaysteps (level,proof,table)
       if (proof[i][3]==='Implication Introduction') {level=level-1};
       displaystep(level,proof[i],table)};
  return true}

function displaystep (level,item,table)
  row.setAttribute('height','30');
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  var widget = document.createElement('input');
  widget.setAttribute('id',item[1]);
  widget.setAttribute('type','checkbox');
  cell.appendChild(widget);
  cell = row.insertCell(1);
  cell.setAttribute('width',24);
  cell.innerHTML = item[1] + '.';
  cell = row.insertCell(2);
  cell.setAttribute('width',380);
  cell.appendChild(displaybarredelement(level,grind(item[2])));
  cell = row.insertCell(3);
  cell.setAttribute('width',216);
  var just = '&nbsp;' + item[3];
  if (item.length > 4)
  cell.innerHTML = just;
  return true}

function displayfirst (level,table)
  row.setAttribute('height','30');
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  var widget = document.createElement('input');
  widget.setAttribute('type','checkbox');
  widget.setAttribute('onChange','doselectall(this)');
  cell.appendChild(widget);  
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.appendChild(displaybarredelement(level,'<span style="color:#888888">Select All</span>'));
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  return true}

function displayempty (level,table)
  row.setAttribute('height','30');
  var cell = row.insertCell(0);
  cell.setAttribute('width',20);
  cell = row.insertCell(1);
  cell.setAttribute('width',20);
  cell = row.insertCell(2);
  cell.setAttribute('width',400);
  cell.appendChild(displaybarredelement(level,''));
  cell = row.insertCell(3);
  cell.setAttribute('width',200);
  return true}

function displaybarredelement (level,stuff)
 {var table = document.createElement('table');
  table.setAttribute('cellspacing','0');
  table.setAttribute('cellpadding','0');
  var row = table.insertRow(0);
  row.setAttribute('height','30');
  for (var i=level; i>0; i--)
      {var cell = row.insertCell(row.cells.length);
       cell.setAttribute('style','border-left:2px solid #000000;padding:5px');
       cell.innerHTML = '&nbsp;'};
  var cell = row.insertCell(row.cells.length);
  cell.innerHTML = stuff;
  cell = row.insertCell(1);
  cell.innerHTML = '&nbsp;';
  return table}

function prooflevel (proof)
 {var level = 1;
  for (var i=1; i<proof.length; i++)
      {if (proof[i][3]==='Assumption') {level=level+1};
       if (proof[i][3]==='Implication Introduction') {level=level-1}};
  return level}

//------------------------------------------------------------------------------
// showsignature
//------------------------------------------------------------------------------

function showsignature ()
 {objectconstants = getobjectconstants(proof);
  functionconstants = getfunctionconstants(proof);
  var area = document.getElementById('objects');
  var n = area.childNodes.length;
  for (var i=0; i<n; i++) {area.removeChild(area.childNodes[0])};
  area.innerHTML = renderconstants(objectconstants);
  area = document.getElementById('functions');
  var n = area.childNodes.length;
  for (var i=0; i<n; i++) {area.removeChild(area.childNodes[0])};
  area.innerHTML = renderconstants(functionconstants);
  return true}

function renderconstants (constants)
 {var exp = '';
  if (constants.length>0) {exp = constants[0]};
  for (var i=1; i<constants.length; i++)
      {exp += ', ' + constants[i]};
  return exp}

//------------------------------------------------------------------------------
// showbuttons
//------------------------------------------------------------------------------

function showbuttons ()
 {objectconstants = getobjectconstants(proof);
  functionconstants = getfunctionconstants(proof);
  if (objectconstants.length===0 && functionconstants.length===0)
     {document.getElementById('dodc').disabled=true;
      document.getElementById('doind').disabled=true};
  if (objectconstants.length>0 && functionconstants.length===0)
     {document.getElementById('dodc').disabled=false;
      document.getElementById('doind').disabled=true}
  if (functionconstants.length>0)
     {document.getElementById('dodc').disabled=true;
      document.getElementById('doind').disabled=false}

  if (prooflevel(proof)===1)
     {document.getElementById('dopremise').disabled=false;
      document.getElementById('doii').disabled=true;
      return true};
  document.getElementById('dopremise').disabled=true;
  document.getElementById('doii').disabled=false;

  return true}

//------------------------------------------------------------------------------
// Step Operations
//------------------------------------------------------------------------------

 {proofs[name] = proof;
  name = node.value;
  proof = proofs[name];
  showproof(proof);
  return true}

//------------------------------------------------------------------------------

function donew ()
 {proofs[name] = proof;
  var current = document.getElementById('current');
  name = prompt('Proof name:');
  proof = makeproof();
  var option = document.createElement("option");
  option.text = name;
  current.add(option);
  current.value = name;
  showproof(proof);
  return true}

//------------------------------------------------------------------------------

function doremove ()
 {if (name==='main') {alert('Cannot remove main proof.'); return false};
  if (!confirm('Remove proof ' + name + '?')) {return false};
  var current = document.getElementById('current');
  current.value = name;
  current.remove(current.selectedIndex);
  current.value = 'main';
  proof = proofs['main'];
  showproof(proof);
  return true}

//------------------------------------------------------------------------------

function docopy ()
 {clipboard = deepcopy(proof);
  alert('Proof copied to clipboard.')
  return true}

//------------------------------------------------------------------------------

function dopaste ()
 {proof = deepcopy(clipboard);
  showproof(proof);
  return true}

//------------------------------------------------------------------------------
// Select all
//------------------------------------------------------------------------------

function doselectall (node)
  for (var i=1; i<proof.length; i++)
      {document.getElementById(i).checked = parity};
  return true}
// dopremise
//------------------------------------------------------------------------------

  if (exp==='error') {alert('Syntax error'); return false};
// doassumption
//------------------------------------------------------------------------------

  proof[proof.length] = makestep(proof.length,exp,'Assumption');
// doreiteration
//------------------------------------------------------------------------------

function doreiteration ()
 {var steps = getcheckedpremises(proof);
  if (steps.length===0)

function getcheckedstep (proof)
 {for (var i=1; i<proof.length; i++)
  return false}

function getcheckedpremises (proof)
 {var assumptions = getassumptions(proof);
  var steps = seq();
  for (var i=1; i<proof.length; i++)
          {steps[steps.length] = i}};
  return steps}

function getassumptions (proof)
 {var level = 0;
  var assumptions = seq();
  for (var i=proof.length-1; i>0; i--)
      {if (proof[i][3]==='Implication Introduction') {level = level+1};
       if (proof[i][3]==='Assumption')
          {if (level===0) {assumptions = adjoin(i,assumptions)};
           if (level>0) {level = level-1}}};
  return assumptions}

function compatible (item,assumptions)
 {var step = proof[item];
  if (step[3]==='Assumption' && !findq(item,assumptions)) {return false};
  if (step[3]==='Implication Introduction')
     {assumptions = assumptions.slice(0);
      assumptions[assumptions.length] = step[4];
      return compatible(step[5],assumptions)};
  for (var j=4; j<step.length; j++)
      {if (!compatible(step[j],assumptions)) {return false}};
  return true}

//------------------------------------------------------------------------------
// dott
//------------------------------------------------------------------------------

function dott ()
  var premises=seq();
  for (var i=0; i<steps.length; i++) {premises[i] = proof[steps[i]][2]};
  var step = makestep(proof.length,conclusion,'Truth Table').concat(steps);
  if (entails(maksand(premises),conclusion)) {proof[proof.length] = step};

function entails (p,q)
 {var cl = getconstants(q,getconstants(p,seq()));
  var al = new Array(cl.length);
  return checkentails(p,q,cl,al,0)}

function getconstants (p,cl)
 {if (symbolp(p)) {return adjoinit(p,cl)};
  if (p[0]==='not') {return getconstants(p[1],cl)};
  if (p[0]==='and')
     {for (var i=1; i<p.length; i++) {cl = getconstants(p[i],cl)};
      return cl};
  if (p[0]==='or')
     {for (var i=1; i<p.length; i++) {cl = getconstants(p[i],cl)};
      return cl};
  if (p[0]==='implication')
     {return getconstants(p[2],getconstants(p[1],cl))};
  if (p[0]==='equivalence')
     {return getconstants(p[2],getconstants(p[1],cl))};
  return adjoinit(p,cl)}

function checkentails (p,q,cl,al,n)
 {if (n>=cl.length) {return (!checktruth(p,cl,al)||checktruth(q,cl,al))};
  al[n] = true;
  if (!checkentails(p,q,cl,al,n+1)) {return false};
  al[n] = false;
function checktruth (p,cl,al)
     {for (var i=1; i<p.length; i++)
          {if (!checktruth(p[i],cl,al)) {return false}};
      return true};
  if (p[0]==='or')
     {for (var i=1; i<p.length; i++)
          {if (checktruth(p[i],cl,al)) {return true}};
      return false};
  if (p[0]==='equivalence')
     {return (checktruth(p[1],cl,al)===checktruth(p[2],cl,al))}
     {return (!checktruth(p[1],cl,al)||checktruth(p[2],cl,al))};

function checkvalue (p,cl,al)
 {for (var i=0; i<cl.length; i++)
      {if (equalp(p,cl[i])) {return al[i]}}
  return false}

function untt ()
// doshortcut
//------------------------------------------------------------------------------

function doshortcut ()
  var steps = getcheckedpremises(proof);

function unshortcut ()
// dodelete
//------------------------------------------------------------------------------

function dodelete ()
  showproof(proof);

function getnewproof (proof)
 {var concordance = seq(0);
  var newproof = makeproof();
  var newstep = 0;
  for (var i=1; i<proof.length; i++)
          {concordance[i] = false}
       else {newstep=newstep+1;
             concordance[i]=newstep;
             updatesupport(proof[i],concordance);
             newproof[newproof.length]=proof[i]}};
  return newproof}

function checksupport (step,concordance)
  for (var j=4; j<step.length; j++)
// doni
//------------------------------------------------------------------------------

function doni ()
  if (steps.length==0)

function ni (p,q)
      equalp(p[1],q[1]) && complementaryp(p[2],q[2]))

function complementaryp (p,q)
 {return (!symbolp(q) && q[0]=='not' && equalp(p,q[1]))}

//------------------------------------------------------------------------------
// done
//------------------------------------------------------------------------------

  if (steps.length==0)

function ne (p)
// doai
//------------------------------------------------------------------------------

function doai ()
  if (steps.length==0)

function ai (p,q)
// doae
//------------------------------------------------------------------------------

  if (steps.length==0)
function ae (p)
// dooi
//------------------------------------------------------------------------------

function dooi ()
  if (steps.length==0)
       result = oi(exp,proof[steps[i]][2]);
       proof[proof.length]=makestep(proof.length,result,'Or Introduction',steps[i])};

function oi (p,q)

function unoi ()
// dooe
//------------------------------------------------------------------------------

  if (steps.length==0)
  for (var i=0; i<steps.length; i++)
          {for (var j=0; j<steps.length; j++)
               {if (!symbolp(proof[steps[j]][2]) &&
                    proof[steps[j]][2][0]==='implication' &&
                    equalp(proof[steps[j]][2][1],proof[steps[i]][2][1]))
                   {for (var k=0; k<steps.length; k++)
                        {if (!symbolp(proof[steps[k]][2]) &&
                             proof[steps[k]][2][0]=='implication' &&
                             equalp(proof[steps[k]][2][1],proof[steps[i]][2][2]) &&
                             equalp(proof[steps[k]][2][2],proof[steps[j]][2][2]))
                         proof[proof.length]=makestep(proof.length,proof[steps[k]][2][2],
                                                        'Or Elimination',
                                                         steps[i],
                                                         steps[j],
                                                         steps[k])}}}}};
  return true}

//------------------------------------------------------------------------------
// doii
//------------------------------------------------------------------------------

  var start = getassumption(proof);
  if (start)
     {var result = makeimplication(proof[start][2],proof[proof.length-1][2])};
      proof[proof.length]=makestep(proof.length,result,'Implication Introduction',start,proof.length-1);
  showproof(proof);
  return true}

 {var level = 0;
  for (var i=proof.length-1; i>0; i--)
      {if (proof[i][3]==='Implication Introduction') {level = level+1};
       if (proof[i][3]==='Assumption')
          {if (level===0) {return i} else {level = level-1}}};
  return false}

//------------------------------------------------------------------------------
// doie
//------------------------------------------------------------------------------

function doie ()
  if (steps.length==0)
// dobi
//------------------------------------------------------------------------------

function dobi ()
  if (steps.length==0)
      !symbolp(q) && q[0] == 'implication' &&
      equalp(p[1],q[2]) && equalp(p[2],q[1]))
// dobe
//------------------------------------------------------------------------------

function dobe ()
  if (steps.length==0)

function be (p)

//------------------------------------------------------------------------------
// doqi
//------------------------------------------------------------------------------

  proof[proof.length]=makestep(proof.length,result,'Equality Introduction');
// doqe
//------------------------------------------------------------------------------

function doqe ()
  if (steps.length==0)
       if (!symbolp(eqn) && eqn[0]=='equal')
          {var sigma = eqn[1];
           var tau = eqn[2];
           for (var j=0; j<steps.length; j++)
               {if (i!=j)
                   {var results = substitutions(sigma,tau,proof[steps[j]][2]);
           for (var j=0; j<steps.length; j++)
               {if (i!=j)
                   {var results = substitutions(tau,sigma,proof[steps[j]][2]);

//------------------------------------------------------------------------------
// doui
//------------------------------------------------------------------------------

function doui ()
  var steps = getcheckedpremises(proof);
  if (steps.length==0)
          {proof[proof.length]=makestep(proof.length,result,'Universal Introduction',steps[i])}};

function ui (nu,phi)
 {if (amongp(nu,phi) && trapped(nu,proof)) {return false};
  return makeuniversal(nu,phi)}

function trapped (nu,proof)
 {var step = proof.length-1;
  while (step && step>0)
   {if (proof[step][3]==='Assumption' &&
        find(nu,freevars(proof[step][2],[],nil)))
       {return true};
    step = backskip(proof,step)};
  return false}

function backskip (proof,step)
 {if (proof[step][3]==='Implication Introduction')
     {var level=1;
      for (var i=step-1; i>1; i--)
          {if (level<=0) {return i};
           if (proof[i][3]==='Implication Introduction') {level=level+1};
           if (proof[i][3]==='Assumption') {level=level-1}};
      return false};
  return step-1}

//------------------------------------------------------------------------------
// doue
//------------------------------------------------------------------------------

function doue ()
  if (steps.length==0)
          {var nu = proof[steps[i]][2][1];
           var phi = proof[steps[i]][2][2];
           if (substitutablep(tau,nu,phi))
              {var result = subst(tau,nu,phi);

function unue ()
//------------------------------------------------------------------------------
// doei
//------------------------------------------------------------------------------

  if (steps.length==0)
            proof[proof.length]=makestep(proof.length,result,'Existential Introduction',steps[i])}};
// doee
//------------------------------------------------------------------------------

  if (steps.length==0)

function ee (p)
     {var sk = freevars(p,[newsym()],nil);
      if (sk.length===1) {sk = seq('skolem',sk[0])} else {sk = seq('skolem',sk)};
      return subst(sk,p[1],p[2])};
  return false}

// dodc
//------------------------------------------------------------------------------

var functionconstants = seq()

  if (steps.length==0)
  var just = dcp(nu,phi,steps);
  var step = makestep(proof.length,psi,'Domain Closure').concat(just);
  if (just) {proof[proof.length]=step};

function dcp (nu,phi,steps)
 {var just=seq();
  for (var i=0; i<objectconstants.length; i++)
       if (step===false) {return false};
       just[just.length]=step};
  return just}

function included (chi,steps)
 {for (i=0; i<steps.length; i++)
      {if (equalp(proof[steps[i]][2],chi)) {return steps[i]}};
  return false}

//------------------------------------------------------------------------------

function getobjectconstants (item)
 {var results = seq();
  for (var i=1; i<item.length; i++)
      {results = getobjectssent(item[i][2],results)};
  return results};

function getobjectssent (p,results)
 {if (symbolp(p)) {return results};
  if (p[0]=='not') {return getobjectslogical(p,results)};
  if (p[0]=='and') {return getobjectslogical(p,results)};
  if (p[0]=='or') {return getobjectslogical(p,results)};
  if (p[0]=='implication') {return getobjectslogical(p,results)};
  if (p[0]=='equivalence') {return getobjectslogical(p,results)};
  if (p[0]=='forall') {return getobjectslogical(p[2],results)};
  if (p[0]=='exists') {return getobjectslogical(p[2],results)};
  if (p[0]=='clause') {return getobjectslogical(p,results)};
  return getobjectsterm(p,results)}

function getobjectslogical (p,results)
 {for (var i=1; i<p.length; i++)
      {results = getobjectssent(p[i],results)};
  return results}

function getobjectsterm (x,results)
 {if (symbolp(x) && !varp(x)) {return adjoin(x,results)};
  if (symbolp(x)) {return results};
  for (var i=1; i<x.length; i++)
      {results = getobjectsterm(x[i],results)};
  return results}

function getfunctionconstants (item)
 {var results = seq();
  for (var i=1; i<item.length; i++)
      {results = getfunctionssent(item[i][2],results)};
  return results};

function getfunctionssent (p,results)
 {if (symbolp(p)) {return results};
  if (p[0]=='not') {return getfunctionslogical(p,results)};
  if (p[0]=='and') {return getfunctionslogical(p,results)};
  if (p[0]=='or') {return getfunctionslogical(p,results)};
  if (p[0]=='implication') {return getfunctionslogical(p,results)};
  if (p[0]=='equivalence') {return getfunctionslogical(p,results)};
  if (p[0]=='forall') {return getfunctionslogical(p[2],results)};
  if (p[0]=='exists') {return getfunctionslogical(p[2],results)};
  if (p[0]=='clause') {return getfunctionslogical(p,results)};
  for (var i=1; i<p.length; i++)
      {results = getfunctionsterm(p[i],results)};
  return results}

function getfunctionslogical (p,results)
 {for (var i=1; i<p.length; i++)
      {results = getfunctionssent(p[i],results)};
  return results}

function getfunctionsterm (x,results)
 {if (symbolp(x)) {return results};
  results = adjoin(x[0],results);
  for (var i=1; i<x.length; i++)
      {results = getfunctionsterm(x[i],results)};
  return results}
// doind
//------------------------------------------------------------------------------

function doind ()
  if (steps.length==0)
  var step = makestep(proof.length,psi,'Induction');
  var base = dcp(nu,phi,steps);
  var inductive = ind(nu,phi,steps);
  if (base && inductive) {proof[proof.length]=step.concat(base,inductive)};

function ind (nu,phi,steps)
 {var just=seq();
  for (var i=0; i<functionconstants.length; i++)
       if (step===false) {return false};
       just[just.length]=step};
  return just}

function coveredp (pi,nu,phi,steps)
 {var pattern = seq('implication',phi,subst(seq(pi,nu),nu,phi));
  for (i=0; i<steps.length; i++)
      {var item = proof[steps[i]][2];
       if (!symbolp(item) && item[0]=='forall' && similarp(pattern,item[2],nu,item[1]))
          {return steps[i]}};
  return false}

function coveredp (pi,nu,phi,steps)
 {var arity = getarity(pi,proof);
  if (!arity) {return false};
  if (arity===1) {return onecoveredp(pi,nu,phi,steps)};
  if (arity===2) {return twocoveredp(pi,nu,phi,steps)};
  return false}

function getarity (pi,exp)
 {if (symbolp(exp)) {return false};
  if (exp.length===0) {return false};
  if (exp[0]===pi) {return exp.length-1};
  for (var i=1; i<exp.length; i++)
      {var ans = getarity(pi,exp[i]);
       if (ans) {return ans}}
  return false} 

function onecoveredp (pi,nu,phi,steps)
 {var pattern = seq('implication',phi,subst(seq(pi,nu),nu,phi));
  for (i=0; i<steps.length; i++)
      {var item = proof[steps[i]][2];
       if (!symbolp(item) && item[0]=='forall' && similarp(pattern,item[2],nu,item[1]))
          {return steps[i]}};
  return false}

function similarp (p,q,x,y)
  if (symbolp(p)) {if (symbolp(q)) {return p==q} else {return false}};
  if (p.length != q.length) {return false};

function twocoveredp (pi,nu,phi,steps)
 {var var1 = newvar();
  var var2 = newvar();
  var test1 = subst(var1,nu,phi);
  var test2 = subst(var2,nu,phi);
  var conclusion = subst(seq(pi,var1,var2),nu,phi);
  var pattern = seq('implication',seq('and',test1,test2),conclusion);
  for (i=0; i<steps.length; i++)
      {var item = proof[steps[i]][2];
       if (!symbolp(item) && item[0]=='forall' &&
           !symbolp(item[2]) && item[2][0]==='forall' &&
           bisimilarp(pattern,item[2][2],var1,item[1],var2,item[2][1]))
          {return steps[i]}};
  return false}

function bisimilarp (p,q,u,x,v,y)
  if (p==v) {return q===y};
  if (symbolp(p)) {if (symbolp(q)) {return p===q} else {return false}};
  if (p.length != q.length) {return false};
      {if (!bisimilarp(p[i],q[i],u,x,v,y)) {return false}};

function unind ()
// doload
//------------------------------------------------------------------------------

function doload ()
 {document.getElementById('operation').style.display = '';
  return true}

function dofileselect (fileobj)
  reader.onload = handleload;
  reader.readAsText(fileobj.files[0]);
  return true}

function handleload (evt)
 {var fileobj = document.getElementById('selector').files[0];
  var filename = fileobj.name;
  var filetype = fileobj.type;
  document.getElementById('proof').innerHTML = evt.target.result;
  unload();
  doinitialize()}

function unload ()

// doreset
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// doxml
//------------------------------------------------------------------------------

function doxml ()
  win.document.writeln('</xmp>');
  if (item[0]=='proof') {return xmlproof(item,n)};
  return ''}

function xmlstep (line,n)
 {step=step+1;
  var exp = '';
  exp += spaces(n) + '<step>\n';
 {var exp = '';
      {exp += xmlize(proof[i],n+1)};

function spaces (n)
 {exp = '';
  for (var i=0; i<n; i++) {exp += '  '};
  return exp}

//------------------------------------------------------------------------------
// Miscellaneous
//------------------------------------------------------------------------------

function deepcopy (x)
 {if (!(x instanceof Array)) {return x};
  var out = new Array(x.length)
  for (var i=0; i<x.length; i++) {out[i] = deepcopy(x[i])};
  return out}

function printseq (p)

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------