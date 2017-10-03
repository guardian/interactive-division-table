import mainTemplate from './src/templates/main.html!text'
import tableTemplate from './src/templates/table.html!text'
import axios from 'axios'
import xmlparse from 'pixl-xml'
import mustache from 'mustache'
import syncrequest from 'sync-request'
import http from 'http'
import fs from 'fs'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var members;

var partialTemplates = {
    "table" : tableTemplate
}

async function getMembers (divisionurl) {

    await axios(divisionurl, { responseType: 'text'}).then(function (response) {
        var data = xmlparse.parse(response.data);
        var ayes = data.Division.AyeMembers.Member;
        var noes = data.Division.NoeMembers.Member;
        ayes.map(function (m) {
            m.vote = "For";
        })
        noes.map(function (m) {
            m.vote = "Against";
        });
        members = ayes.concat(noes);
        members.map(function (m) {
            m.tidyname = m.Name.split(",");
            m.tidyname = m.tidyname[1] + "!" + m.tidyname[0];
            m.tidyname = m.tidyname.replace("Dr ", "").replace("Mr ", "").replace("Mrs ", "").replace("Ms ", "").replace("Sir ", "").replace(". ", " ").replace("!", " ");
            switch(m.Party){
                case "Labour (Co-op)":
                m.shortparty = 'Lab';
                break;
                case "Labour":
                m.shortparty = 'Lab';
                break;
                case "Scottish National Party":
                m.shortparty = "SNP";
                break;
                case "Democratic Unionist Party":
                m.shortparty = "DUP";
                break;
                case "Liberal Democrat":
                m.shortparty = "Lib Dem";
                break;
                case "Conservative":
                m.shortparty = "Con";
                break;
                case "Plaid Cymru":
                m.shortparty = "Plaid";
                break;
                case "Independent":
                m.shortparty = "Ind";
                break;
                default:
                m.shortparty = m.Party;
            }
        })
        fs.writeFileSync("./src/assets/votes.json",JSON.stringify(members));
        console.log(members[0]);
        return (members);
    }), function(error) {console.log('fetch votes ' + error)};
}



export async function render(config) {
    const divisionurl = config.divisionurl;
    await getMembers(divisionurl);
    console.log(members);
    var html = mustache.render(mainTemplate,members,partialTemplates);
    return html;
}