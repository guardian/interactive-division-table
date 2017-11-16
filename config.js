import syncrequest from 'sync-request'
import fs from 'fs'

//var url = "https://interactive.guim.co.uk/docsdata-test/1erErylnClQlXipwvbPjFe6oPo9tXVZsNrIw08-VrD8M.json";

var url = "https://interactive.guim.co.uk/docsdata-test/1K7F-WIZStmf-0PhSGx8t6OweD1txDYK4TeVubgxXfSQ.json"

var res = syncrequest("GET",url);
var json = JSON.parse(res.getBody());
var data = json.sheets.outputDivisions[(json.sheets.outputDivisions.length - 1)];
var members = json.sheets.members;
fs.writeFileSync('./src/assets/fullhouse.json',JSON.stringify(members))

export default data