import syncrequest from 'sync-request'

var url = "https://interactive.guim.co.uk/docsdata-test/1erErylnClQlXipwvbPjFe6oPo9tXVZsNrIw08-VrD8M.json";

var res = syncrequest("GET",url);
var json = JSON.parse(res.getBody());
var data = json.sheets.Sheet1[(json.sheets.Sheet1.length - 1)];

export default data