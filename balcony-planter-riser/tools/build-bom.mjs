import fs from 'node:fs/promises';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const outDir = 'deliverables/bom';
await fs.mkdir(outDir, { recursive: true });
const wb = Workbook.create();
const bom = wb.worksheets.add('BOM');
const assumptions = wb.worksheets.add('Assumptions');
const catalogue = wb.worksheets.add('Catalogue mapping');
const cutPlan = wb.worksheets.add('Cut plan');
wb.comments.setSelf({displayName:'User'});

bom.showGridLines = false;
bom.getRange('A1:L1').merge();
bom.getRange('A1').values = [['Planter riser — provisional component BOM']];
bom.getRange('A2:L2').merge();
bom.getRange('A2').values = [['Model v2 · dimensions reflect the current 450 mm clearance and 90 × 45 mm main framing']];
bom.getRange('A2').values = [['Model v5 enclosure study - matched 70 x 35 upper ties; direct-bearing uprights; 45 x 35 lower frame']];
bom.getRange('A4:L4').values = [[
  'Group','Category','Component IDs','Description','Material / section','Qty','Finished length (mm)','Width (mm)','Thickness (mm)','Total linear (m)','Status','Model mapping'
]];
const rows = [
 ['Top frame','TB-01, TB-02','Front and rear top bearers','H3 structural pine 90×45',2,900,90,45,null,'Provisional','Dark brown; full-width upper rails'],
 ['Top frame','TJ-01 – TJ-03','Depthwise top joists','H3 structural pine 90×45',3,310,90,45,null,'Provisional','Medium brown; three cross-joists'],
 ['Vertical frame','LG-01 – LG-04','Corner legs above 25 mm feet','H3 structural pine 90×45',4,425,90,45,null,'Provisional','Four vertical corner members'],
 ['Base frame','BL-01, BL-02','Front and rear bottom rails','H3 structural pine 90×45',2,900,90,45,null,'Provisional','Same stock as main frame; laid flat'],
 ['Base frame','BE-01, BE-02','Left and right bottom rails','H3 structural pine 90×45',2,220,90,45,null,'Provisional','Between 90 mm-deep long rails'],
 ['Bracing','RB-01, RB-02','Rear diagonal braces','H3 treated pine 70×35',2,523,70,35,null,'Provisional','Two rear diagonals meeting near centre'],
 ['Bracing','EB-01, EB-02','End diagonal braces','H3 treated pine 70×35',2,485,70,35,null,'Provisional','One diagonal at each end'],
 ['Hatch frame','HF-T, HF-B','Hatch top and bottom rails','H3 treated pine 70×35',2,680,70,35,null,'Non-structural','Same stock as braces; flush front surround'],
 ['Hatch frame','HF-L, HF-R','Hatch side stiles','H3 treated pine 70×35',2,295,70,35,null,'Non-structural','Same stock as braces; flush front surround'],
 ['Hatch panel','HP-01','Hatch panel','Exterior structural plywood',1,610,225,12,null,'Provisional','Flush front panel'],
 ['Planter locator','CB-01 – CB-08','Planter capture blocks','Exterior timber',8,72,38,28,null,'Provisional','Two blocks around each planter corner'],
 ['Hardware','JH-01 – JH-03','45 × 90 mm joist hangers','Pryda proprietary connector',3,90,45,null,null,'Mapped','Each hanger is represented by two grey side plates'],
 ['Hardware','AB-H01 – AB-H04','Hold-down angle horizontal legs','Rated reinforced angle',4,70,70,6,null,'Select product','Grey feet at planter corners'],
 ['Hardware','AB-V01 – AB-V04','Hold-down angle vertical legs','Rated reinforced angle',4,76,70,6,null,'Select product','Grey plates against planter posts'],
 ['Isolation','PD-01 – PD-04','Adjustable balcony pedestal feet','UV-stable polymer',4,104,59,25,null,'Provisional','25–40 mm feet kept within 900×400 envelope'],
];
const rowsOptimised = [
 ['Upper tie','Main frame','TB-01','Front upper tie aligned with joists (non-bearing)','H3 structural pine 70x35',1,760,70,35,null,'Provisional','Matches TB-02 between the full-height front uprights'],
 ['Upper tie','Main frame','TB-02','Rear upper tie aligned with joists (non-bearing)','H3 structural pine 70x35',1,760,70,35,null,'Provisional','Meets the rear ends of the top joists between full-height uprights'],
 ['Top frame','Main frame','TJ-01 - TJ-03','Depthwise top joists','H3 structural pine 70x35',3,380,70,35,null,'Provisional','Span cleanly between the matched 35 mm-thick upper ties'],
 ['Vertical frame','Main frame','LG-01 - LG-04','Full-height direct-bearing uprights above 6 mm pads','H3 structural pine 70x35',4,514,70,35,null,'Provisional','All four extend directly to the planter feet'],
 ['Base frame','Main frame','BL-01, BL-02','Front and rear bottom rails','H3 structural pine 45x35',2,760,45,35,null,'Provisional','Reduced section; ties legs and supports litter floor'],
 ['Base frame','Main frame','BE-01, BE-02','Left and right bottom rails','H3 structural pine 45x35',2,380,45,35,null,'Provisional','Reduced section; fits between front and rear legs'],
 ['Cabinet walls','Structural panels','SP-01','Structural rear cabinet wall','12 mm exterior structural plywood',1,760,399,12,null,'Detail required','Continuous fixing around supported rear frame edges'],
 ['Cabinet walls','Structural panels','WL-01, WL-02','Structural left and right cabinet walls','12 mm exterior structural plywood',2,380,399,12,null,'Detail required','Full side walls replace separate side gussets; provide ventilation without breaking required edge fixing'],
 ['Hatch frame','Hatch & access','HF-T, HF-B','Hatch top and bottom rails','Exterior dressed timber 42x19',2,740,42,19,null,'Non-structural','Light cabinet-style removable hatch'],
 ['Hatch frame','Hatch & access','HF-L, HF-R','Hatch side stiles','Exterior dressed timber 42x19',2,295,42,19,null,'Non-structural','Meet the inner faces of the hatch rails without gaps'],
 ['Hatch panel','Hatch & access','HP-01','Hatch panel','12 mm exterior structural plywood',1,656,295,12,null,'Provisional','Cat flap opening and final panel layout TBC'],
 ['Litter fit-out','Litter fit-out','FS-01','Concealed centre floor bearer','H3 structural pine 70x35',1,380,70,35,null,'Provisional','Cut from 70x35 offcut; supports centreline of litter floor'],
 ['Litter fit-out','Litter fit-out','FL-01','Removable sealed litter floor','12 mm exterior structural plywood',1,760,380,12,null,'Provisional','Rests on lower perimeter and centre bearer; add removable waterproof liner'],
 ['Litter fit-out','Litter fit-out','LT-01, LT-02','Placeholder litter tray envelopes','Purchased trays',2,350,330,110,null,'Measure','Replace placeholders with actual tray dimensions'],
 ['Litter fit-out','Hatch & access','CD-01','Cat flap within front hatch','Purchased or fabricated flap',1,230,230,14,null,'TBC','Threshold aligned close to litter floor'],
 ['Hardware','Hardware & fixings','HN-01','Full-width top hatch hinge','Continuous hinge',1,740,8,8,null,'TBC','Size and fixing schedule depend on final hatch weight'],
 ['Hardware','Hardware & fixings','HL-01','Provisional hatch latch','Exterior-rated latch',1,48,34,12,null,'TBC','Select a low-profile latch operable without obstructing the cat flap'],
 ['Hardware','Hardware & fixings','HS-01, HS-02','Provisional hatch stays','Exterior-rated lid stays',2,108,8,8,null,'TBC','Final stay type and length depend on hatch weight and opening angle'],
 ['Hardware','Hardware & fixings','JH-01 - JH-03','Connector for 35 x 70 mm joists','Rated proprietary connector',3,70,35,null,null,'Select product','Existing 45 x 90 hanger mapping is no longer applicable'],
 ['Hardware','Hardware & fixings','JF-01 - JF-12','Joist connector fixing screws','Manufacturer-approved connector screws',12,35,6,null,null,'Select with connector','Model shows two screws at each end of each top joist; final schedule governs quantity'],
 ['Hardware','Hardware & fixings','ST-01 - ST-04','Concealed post-to-upright splice straps','Galvanised steel flat strap',4,300,40,3,null,'Detail required','One flush strap joins each planter post to its corresponding full-height upright; the upper tie remains non-bearing'],
 ['Hardware','Hardware & fixings','SB-01 - SB-08','Upper and lower strap bolts','M8 hot-dip galvanised bolt, nut and washers',8,60,8,null,null,'Provisional','Straps restrain sliding/uplift; bolts do not carry planter dead load'],
 ['Isolation','Isolation / feet','IP-01 - IP-04','Low-profile isolation pads','EPDM / exterior rubber',4,70,45,6,null,'Default','Protects balcony and timber without unnecessary lift'],
 ['Isolation','Isolation / feet','PD-01 - PD-04','Optional adjustable balcony feet','UV-stable polymer',4,104,59,25,null,'Optional','Use only if balcony fall prevents stable level bearing'],
];
bom.getRange(`A5:L${4+rowsOptimised.length}`).values = rowsOptimised;
for(let r=5;r<=4+rowsOptimised.length;r++) bom.getRange(`J${r}`).formulas = [[`=IF(OR(F${r}="",G${r}=""),"",F${r}*G${r}/1000)`]];
bom.getRange(`A${5+rowsOptimised.length}:I${5+rowsOptimised.length}`).merge();
bom.getRange(`A${5+rowsOptimised.length}`).values = [['Modelled component-length total (not a purchase quantity; includes non-timber rows)']];
bom.getRange(`J${5+rowsOptimised.length}`).formulas = [[`=SUM(J5:J${4+rowsOptimised.length})`]];
bom.getRange(`K${5+rowsOptimised.length}:L${5+rowsOptimised.length}`).merge();
bom.getRange(`K${5+rowsOptimised.length}`).values = [['Not a purchase quantity']];

bom.getRange('A1:L1').format = {fill:'#2F4A3D',font:{bold:true,color:'#FFFFFF',size:16},verticalAlignment:'center'};
bom.getRange('A2:L2').format = {fill:'#E8EFEA',font:{color:'#34443B',italic:true}};
bom.getRange('A4:L4').format = {fill:'#8B5E3C',font:{bold:true,color:'#FFFFFF'},wrapText:true,verticalAlignment:'center'};
bom.getRange(`A5:L${4+rowsOptimised.length}`).format = {borders:{insideHorizontal:{style:'thin',color:'#D8D2CB'}},verticalAlignment:'center'};
bom.getRange(`A${5+rowsOptimised.length}:L${5+rowsOptimised.length}`).format = {fill:'#E8EFEA',font:{bold:true,color:'#2F4A3D'},borders:{top:{style:'medium',color:'#2F4A3D'}}};
bom.getRange(`F5:J${5+rowsOptimised.length}`).format.numberFormat = '0.00';
bom.getRange(`F5:I${4+rowsOptimised.length}`).format.numberFormat = '0';
bom.getRange(`A4:L${4+rowsOptimised.length}`).format.wrapText = true;
bom.getRange('A1:L2').format.rowHeight = 25;
bom.getRange('A4:L4').format.rowHeight = 34;
const widths={A:16,B:20,C:22,D:28,E:28,F:8,G:18,H:13,I:15,J:15,K:16,L:34};
for(const [c,w] of Object.entries(widths)) bom.getRange(`${c}:${c}`).format.columnWidth=w;
bom.freezePanes.freezeRows(4);
bom.tables.add(`A4:L${4+rowsOptimised.length}`,true,'RiserBOM').style='TableStyleMedium4';

assumptions.showGridLines=false;
assumptions.getRange('A1:D1').merge();assumptions.getRange('A1').values=[['Model assumptions and decisions needed']];
assumptions.getRange('A3:D3').values=[['Input','Current value','Status','Why it matters']];
const arows=[
 ['Clear space below top bearer',450,'User confirmed','Sets leg length; top bearer adds 90 mm to planter lift'],
 ['Main framing section','90 × 45 mm','Provisional','Must be checked against timber species, grade and wet load'],
 ['Planter footprint','900 × 400 mm','User confirmed','Controls support-frame envelope'],
 ['Planter body height',300,'User confirmed','Exterior model only'],
 ['Loaded planter mass','Unknown','Required','Needed for bending, connection and balcony-load checks'],
 ['Drilling existing corner posts','Unknown','Required','Determines through-bolt versus non-invasive cradle attachment'],
 ['Available stock lengths','Unknown','Required','Needed for purchase optimisation and cutting plan'],
 ['Saw kerf / waste allowance','Unknown','Required','Needed for final purchase quantities'],
 ['Hatch opening panel','610 × 225 mm','Model-derived','Flush within the 900 × 400 mm envelope'],
 ['Stock families','90×45 frame; 70×35 braces and hatch','Optimised','Two timber profiles before cladding'],
];
const arowsOptimised=[
 ['Clear space below upper ties',450,'User confirmed','Sets upright length; the 70 mm tie depth brings the planter base to 520 mm above the balcony'],
 ['Upper tie section','70 x 35 mm','Optimised','TB-01 and TB-02 match and remain outside the direct planter bearing path'],
 ['Primary frame section','70 x 35 mm','Optimised','Full-height uprights, matched upper ties, short top joists and floor bearer'],
 ['Lower frame section','45 x 35 mm','Provisional','Reduced because it ties legs and supports the light litter fit-out, not the planter'],
 ['Racking system','12 mm structural rear and side cabinet walls','Provisional','The cabinet walls replace separate gussets and require supported edges plus an exterior-rated fixing schedule'],
 ['Planter footprint','900 x 450 mm','User confirmed','Owner sketch overrides earlier 400 mm product estimate'],
 ['Existing planter members','50 x 50 posts; 40 mm rails','User confirmed','Matches the coloured underside sketch'],
 ['Planter body height',300,'User confirmed','Exterior model only'],
 ['Design allowance',150,'Provisional kg','Wet planter, trellis and cat impact allowance; confirm actual loaded mass'],
 ['Loaded planter mass','Unknown','Required','Needed before final structural sizing'],
 ['Drilling existing corner posts','Unknown','Required','Determines through-bolt versus non-invasive cradle attachment'],
 ['Litter tray envelope','2 x 350 x 330 x 110 mm','Unconfirmed','Placeholder fit within 760 x 380 mm floor; measure actual trays'],
 ['Feet','6 mm rubber pads default; 25 mm adjustable optional','Provisional','Use adjustable feet only if balcony fall prevents stable bearing'],
 ['Hatch frame section','42 x 19 mm','Non-structural','Top-hinged access hatch with provisional 230 mm cat flap'],
 ['Stock families','70x35; 45x35; 42x19; sheet material','Optimised','No 90 x 45 framing remains; both upper ties use the primary 70 x 35 stock'],
];
assumptions.getRange(`A4:D${3+arowsOptimised.length}`).values=arowsOptimised;
assumptions.getRange('A1:D1').format={fill:'#2F4A3D',font:{bold:true,color:'#FFFFFF',size:16}};
assumptions.getRange('A3:D3').format={fill:'#8B5E3C',font:{bold:true,color:'#FFFFFF'}};
assumptions.getRange(`A4:D${3+arowsOptimised.length}`).format={borders:{insideHorizontal:{style:'thin',color:'#D8D2CB'}},wrapText:true,verticalAlignment:'center'};
for(const [c,w] of Object.entries({A:30,B:24,C:18,D:52})) assumptions.getRange(`${c}:${c}`).format.columnWidth=w;
assumptions.freezePanes.freezeRows(3);

catalogue.showGridLines=false;
catalogue.getRange('A1:I1').merge();catalogue.getRange('A1').values=[['Melbourne catalogue mapping — candidate products']];
catalogue.getRange('A2:I2').merge();catalogue.getRange('A2').values=[['Prices and availability vary by store and date. Confirm stock, treatment, grade and connector fastener schedule before purchase.']];
catalogue.getRange('A4:I4').values=[['BOM codes','Retailer','Candidate item','Catalogue identifier','Pack / stock length','Indicative qty','Indicative price','URL','Notes']];
const catalogueRows=[
 ['TB, TJ, LG, BL, BE','Bowens','90×45 mm Treated Pine MGP10 H3 LOSP Kiln Dried','SKU MLPT090045','3.6 m',2,null,'https://www.bowens.com.au/p/90x45mm-pine-mgp10-h3-losp-kiln-dried/','Primary timber order: select the 3.6 m variant; two lengths cover the current cuts plus kerf'],
 ['RB, EB, HF','Bowens','70×35 mm Treated Pine MGP10 H3 LOSP Kiln Dried','SKU MLPT070035','2.4 m',2,null,'https://www.bowens.com.au/p/70x35mm-pine-mgp10-h3-losp-kiln-dried/','One length for braces and one for hatch frame; no CCA hatch timber near the planter'],
 ['HP-01','Bowens','Pine Plywood F8 Structural Black 12 mm','SKU PHPB122412','2400×1200×12 mm sheet',1,75.90,'https://www.bowens.com.au/p/pine-plywood-f8-structural-black/?size=2400x1200x12mm&uom=ST%7C1','Exact exterior A-bond sheet; ask whether a suitable offcut or cutting service is available'],
 ['TJ-01 – TJ-03','Bunnings','Pryda Joist Hanger to suit 45 × 90 mm','I/N 0294207','Each',3,2.20,'https://www.bunnings.com.au/pryda-joist-hanger-to-suit-45-x-90mm_p0294207','Use only manufacturer-specified nails or Pryda 35 mm connector screws'],
 ['TJ fasteners','Bunnings','Pryda Timber Connector Screw 12G × 35 mm Hex Head','I/N 0084754','Pack of 50',1,null,'https://www.bunnings.com.au/pryda-timber-connector-screw-12g-x-35mm-hex-head-pack-50_p0084754','Exact matching connector screws; do not substitute decking screws'],
 ['AB-H / AB-V','Bunnings','Pryda Angle Bracket 75 × 50 × 150 mm','I/N 0199573','Each',4,null,'https://www.bunnings.com.au/pryda-angle-bracket-75-x-50-x-5-x-150mm-each_p0199573','Candidate only; verify geometry against actual planter posts before drilling'],
 ['AB bolts','Bunnings','Zenith M8 × 60 mm Hot Dipped Galvanised Cup Head Bolt and Nut','I/N 2310034','Each',8,0.74,'https://www.bunnings.com.au/zenith-m8-x-60mm-hot-dipped-galvanised-cup-head-bolt-and-nut-each_p2310034','Current model shows two bolts per hold-down; add suitable M8 galvanised washers after bracket fit-up'],
 ['PD-01 – PD-04','Bunnings','Builders Edge 25–40 mm Minifoot Pedestal Feet','I/N 2450073','Each',4,9.14,'https://www.bunnings.com.au/builders-edge-25-40mm-minifoot-pedestal-feet_p2450073','Rated >200 kg each by listing; final floor pressure and balcony capacity still require checking'],
];
const catalogueRowsOptimised=[
 ['TB, TJ, LG, FS','Bowens','70x35 mm Treated Pine MGP10 H3 LOSP Kiln Dried','SKU MLPT070035','2.4 m',3,null,'https://www.bowens.com.au/p/70x35mm-pine-mgp10-h3-losp-kiln-dried/','Three lengths cover four uprights, both matched upper ties, three top joists and the floor bearer'],
 ['BL, BE','Either','H3 structural pine approximately 45x35 mm','Confirm exact item','2.4 m',1,null,'','Reduced lower frame section; confirm graded treated stock before purchase'],
 ['SP, WL, HP, FL','Bowens','Pine Plywood F8 Structural Black 12 mm','SKU PHPB122412','2400x1200x12 mm sheet',1,75.90,'https://www.bowens.com.au/p/pine-plywood-f8-structural-black/?size=2400x1200x12mm&uom=ST%7C1','Rear and side structural walls, hatch and floor nest from one common sheet; seal every cut edge'],
 ['HF','Either','Exterior dressed timber approximately 42x19 mm','Confirm exact item','2.4 m',1,null,'','Non-structural hatch stock; exact individual product still to be selected'],
 ['TJ connectors','Bunnings','Rated connector to suit 35 x 70 mm joists','Confirm exact item','Each',3,null,'','Old 45 x 90 Pryda hanger does not fit the optimised joists'],
 ['Connector fasteners','Bunnings','Pryda Timber Connector Screw 12G x 35 mm Hex Head','I/N 0084754','Pack of 50',1,null,'https://www.bunnings.com.au/pryda-timber-connector-screw-12g-x-35mm-hex-head-pack-50_p0084754','Use only where permitted by the selected connector schedule'],
 ['ST-01 - ST-04','Either','Galvanised flat splice strap approximately 300 x 40 x 3 mm','Confirm exact item','Each',4,null,'','Concealed detail replaces timber capture blocks and angle brackets; drill pattern must avoid timber edges'],
 ['ST fixing bolts','Bunnings','Zenith M8 x 60 mm Hot Dipped Galvanised Cup Head Bolt and Nut','I/N 2310034','Each',8,0.74,'https://www.bunnings.com.au/zenith-m8-x-60mm-hot-dipped-galvanised-cup-head-bolt-and-nut-each_p2310034','Two per strap plus suitable M8 galvanised washers; verify final grip length'],
 ['IP-01 - IP-04','Either','Exterior EPDM isolation pad approximately 70 x 45 x 6 mm','Confirm exact item','Each',4,null,'','Default option; can be cut from a suitable exterior rubber sheet'],
 ['PD-01 - PD-04','Bunnings','Builders Edge 25-40 mm Minifoot Pedestal Feet','I/N 2450073','Each',4,9.14,'https://www.bunnings.com.au/builders-edge-25-40mm-minifoot-pedestal-feet_p2450073','Optional only if balcony fall requires levelling'],
];
catalogue.getRange(`A5:I${4+catalogueRowsOptimised.length}`).values=catalogueRowsOptimised;
catalogue.getRange('A1:I1').format={fill:'#2F4A3D',font:{bold:true,color:'#FFFFFF',size:16}};
catalogue.getRange('A2:I2').format={fill:'#FFF1D6',font:{color:'#6D4C22',italic:true},wrapText:true};
catalogue.getRange('A4:I4').format={fill:'#8B5E3C',font:{bold:true,color:'#FFFFFF'},wrapText:true};
catalogue.getRange(`A5:I${4+catalogueRowsOptimised.length}`).format={borders:{insideHorizontal:{style:'thin',color:'#D8D2CB'}},wrapText:true,verticalAlignment:'center'};
catalogue.getRange(`F5:G${4+catalogueRowsOptimised.length}`).format.numberFormat='0.00';
for(const [c,w] of Object.entries({A:18,B:12,C:38,D:24,E:18,F:14,G:16,H:58,I:52})) catalogue.getRange(`${c}:${c}`).format.columnWidth=w;
catalogue.freezePanes.freezeRows(4);
catalogue.tables.add(`A4:I${4+catalogueRowsOptimised.length}`,true,'CatalogueMap').style='TableStyleMedium4';

cutPlan.showGridLines=false;
cutPlan.getRange('A1:J1').merge();cutPlan.getRange('A1').values=[['Provisional stock-by-stock cutting plan']];
cutPlan.getRange('A2:J2').merge();cutPlan.getRange('A2').values=[['Assumes a 3 mm saw kerf. Recheck every finished dimension and actual stock length before cutting.']];
cutPlan.getRange('A4:J4').values=[['Stock ID','Bowens product','Raw length (mm)','Component ID','Cut length (mm)','Sequence','Kerf allowance (mm)','Used incl. kerf (mm)','Remaining (mm)','Notes']];
const cuts=[
 ['90-01','MLPT090045 — 90×45 H3 LOSP',3600,'TB-01',900,1,3,null,null,''],
 ['90-01','MLPT090045 — 90×45 H3 LOSP',3600,'TB-02',900,2,3,null,null,''],
 ['90-01','MLPT090045 — 90×45 H3 LOSP',3600,'BL-01',900,3,3,null,null,''],
 ['90-01','MLPT090045 — 90×45 H3 LOSP',3600,'LG-01',425,4,3,null,null,''],
 ['90-01','MLPT090045 — 90×45 H3 LOSP',3600,'LG-02',425,5,0,null,null,'Last piece; no following kerf allowance'],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'BL-02',900,1,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'LG-03',425,2,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'LG-04',425,3,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'TJ-01',310,4,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'TJ-02',310,5,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'TJ-03',310,6,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'BE-01',220,7,3,null,null,''],
 ['90-02','MLPT090045 — 90×45 H3 LOSP',3600,'BE-02',220,8,0,null,null,'Last piece; no following kerf allowance'],
 ['70-01','MLPT070035 — 70×35 H3 LOSP',2400,'RB-01',523,1,3,null,null,'Brace ends require final angle cuts'],
 ['70-01','MLPT070035 — 70×35 H3 LOSP',2400,'RB-02',523,2,3,null,null,'Brace ends require final angle cuts'],
 ['70-01','MLPT070035 — 70×35 H3 LOSP',2400,'EB-01',485,3,3,null,null,'Brace ends require final angle cuts'],
 ['70-01','MLPT070035 — 70×35 H3 LOSP',2400,'EB-02',485,4,0,null,null,'Last piece; verify brace geometry in situ'],
 ['70-02','MLPT070035 — 70×35 H3 LOSP',2400,'HF-T',680,1,3,null,null,''],
 ['70-02','MLPT070035 — 70×35 H3 LOSP',2400,'HF-B',680,2,3,null,null,''],
 ['70-02','MLPT070035 — 70×35 H3 LOSP',2400,'HF-L',295,3,3,null,null,''],
 ['70-02','MLPT070035 — 70×35 H3 LOSP',2400,'HF-R',295,4,0,null,null,'Last piece'],
 ['PLY-01','PHPB122412 — 12 mm F8 exterior ply',2400,'HP-01',610,1,3,null,null,'Cross dimension 225 mm; seal all cut edges'],
];
const cutsOptimised=[
 ['70-01','MLPT070035 - 70x35 H3 LOSP',2400,'LG-01',514,1,3,null,null,'Full-height direct-bearing upright'],
 ['70-01','MLPT070035 - 70x35 H3 LOSP',2400,'LG-02',514,2,3,null,null,'Full-height direct-bearing upright'],
 ['70-01','MLPT070035 - 70x35 H3 LOSP',2400,'LG-03',514,3,3,null,null,'Full-height direct-bearing upright'],
 ['70-01','MLPT070035 - 70x35 H3 LOSP',2400,'LG-04',514,4,0,null,null,'335 mm remainder'],
 ['70-02','MLPT070035 - 70x35 H3 LOSP',2400,'TB-01',760,1,3,null,null,'Non-bearing front tie aligned with joists'],
 ['70-02','MLPT070035 - 70x35 H3 LOSP',2400,'TB-02',760,2,3,null,null,'Matching non-bearing rear tie'],
 ['70-02','MLPT070035 - 70x35 H3 LOSP',2400,'TJ-01',380,3,3,null,null,''],
 ['70-02','MLPT070035 - 70x35 H3 LOSP',2400,'TJ-02',380,4,0,null,null,'111 mm remainder'],
 ['70-03','MLPT070035 - 70x35 H3 LOSP',2400,'TJ-03',380,1,3,null,null,''],
 ['70-03','MLPT070035 - 70x35 H3 LOSP',2400,'FS-01',380,2,0,null,null,'1637 mm remainder'],
 ['45-01','45x35 H3 structural pine - exact item TBC',2400,'BL-01',760,1,3,null,null,'Fits between front legs'],
 ['45-01','45x35 H3 structural pine - exact item TBC',2400,'BL-02',760,2,3,null,null,'Fits between rear legs'],
 ['45-01','45x35 H3 structural pine - exact item TBC',2400,'BE-01',380,3,3,null,null,''],
 ['45-01','45x35 H3 structural pine - exact item TBC',2400,'BE-02',380,4,0,null,null,'111 mm remainder'],
 ['42-01','Exterior dressed timber 42x19',2400,'HF-T',740,1,3,null,null,'Exact product to confirm'],
 ['42-01','Exterior dressed timber 42x19',2400,'HF-B',740,2,3,null,null,''],
 ['42-01','Exterior dressed timber 42x19',2400,'HF-L',295,3,3,null,null,''],
 ['42-01','Exterior dressed timber 42x19',2400,'HF-R',295,4,0,null,null,'321 mm usable remainder'],
 ['PLY-A','PHPB122412 - 12 mm F8 exterior ply',2400,'SP-01',760,1,3,null,null,'Cross dimension 399 mm; structural rear wall'],
 ['PLY-B','PHPB122412 - 12 mm F8 exterior ply',2400,'HP-01',656,1,3,null,null,'Cross dimension 295 mm; cat flap cut-out TBC'],
 ['PLY-B','PHPB122412 - 12 mm F8 exterior ply',2400,'FL-01',760,2,0,null,null,'Cross dimension 380 mm; seal every edge'],
 ['PLY-C','PHPB122412 - 12 mm F8 exterior ply',2400,'WL-01',380,1,3,null,null,'Cross dimension 399 mm; structural left wall'],
 ['PLY-C','PHPB122412 - 12 mm F8 exterior ply',2400,'WL-02',380,2,0,null,null,'Cross dimension 399 mm; structural right wall; all PLY strips nest on one full sheet'],
];
cutPlan.getRange(`A5:J${4+cutsOptimised.length}`).values=cutsOptimised;
for(let r=5;r<=4+cutsOptimised.length;r++){cutPlan.getRange(`H${r}`).formulas=[[`=E${r}+G${r}`]];cutPlan.getRange(`I${r}`).formulas=[[`=C${r}-SUMIFS($H$5:$H$${4+cutsOptimised.length},$A$5:$A$${4+cutsOptimised.length},A${r})`]];}
cutPlan.getRange('A1:J1').format={fill:'#2F4A3D',font:{bold:true,color:'#FFFFFF',size:16}};
cutPlan.getRange('A2:J2').format={fill:'#FFF1D6',font:{color:'#6D4C22',italic:true}};
cutPlan.getRange('A4:J4').format={fill:'#8B5E3C',font:{bold:true,color:'#FFFFFF'},wrapText:true};
cutPlan.getRange(`A5:J${4+cutsOptimised.length}`).format={borders:{insideHorizontal:{style:'thin',color:'#D8D2CB'}},verticalAlignment:'center'};
cutPlan.getRange(`C5:I${4+cutsOptimised.length}`).format.numberFormat='0';
for(const [c,w] of Object.entries({A:12,B:32,C:16,D:15,E:16,F:10,G:18,H:18,I:16,J:42})) cutPlan.getRange(`${c}:${c}`).format.columnWidth=w;
cutPlan.freezePanes.freezeRows(4);
cutPlan.tables.add(`A4:J${4+cutsOptimised.length}`,true,'CutPlan').style='TableStyleMedium4';

const preview = await wb.render({sheetName:'BOM',range:`A1:L${5+rowsOptimised.length}`,scale:1.2,format:'png'});
await fs.writeFile(`${outDir}/bom-preview.png`,new Uint8Array(await preview.arrayBuffer()));
const assumptionsPreview = await wb.render({sheetName:'Assumptions',range:`A1:D${3+arowsOptimised.length}`,scale:1.1,format:'png'});
await fs.writeFile(`${outDir}/assumptions-preview.png`,new Uint8Array(await assumptionsPreview.arrayBuffer()));
const cataloguePreview = await wb.render({sheetName:'Catalogue mapping',range:`A1:I${4+catalogueRowsOptimised.length}`,scale:1.0,format:'png'});
await fs.writeFile(`${outDir}/catalogue-preview.png`,new Uint8Array(await cataloguePreview.arrayBuffer()));
const cutPreview = await wb.render({sheetName:'Cut plan',range:`A1:J${4+cutsOptimised.length}`,scale:1.0,format:'png'});
await fs.writeFile(`${outDir}/cut-plan-preview.png`,new Uint8Array(await cutPreview.arrayBuffer()));
const check=await wb.inspect({kind:'table',range:`BOM!A1:L${5+rowsOptimised.length}`,include:'values,formulas',tableMaxRows:30,tableMaxCols:12});
console.log(check.ndjson);
const errors=await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',options:{useRegex:true,maxResults:100},summary:'formula scan'});
console.log(errors.ndjson);
const file=await SpreadsheetFile.exportXlsx(wb);await file.save(`${outDir}/planter-riser-bom.xlsx`);
