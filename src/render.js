import mainTemplate from './src/templates/main.html!text'
import tableTemplate from './src/templates/table.html!text'
import axios from 'axios'
import xmlparse from 'pixl-xml'
import mustache from 'mustache'
import syncrequest from 'sync-request'
import http from 'http'
import fs from 'fs'
//import cleannumber from 'sean-utils'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


function cleannumber(input) {
    if (typeof input == "string") {
        input = input.replace(/,/g, "");
        return parseFloat(input);
    }
    if (typeof input == "number") {
        return input;
    }
}

var members, summary;

var partialTemplates = {
    "table" : tableTemplate
}

async function getMembers (divisionurl) {

    await axios(divisionurl, { responseType: 'text'}).then(function (response) {
        var data = xmlparse.parse(response.data);
        fs.writeFileSync("./src/assets/data.json",JSON.stringify(data));
        summary = {
            "for" : cleannumber(data.Division.AyeCount),
            "against" : cleannumber(data.Division.NoeCount)
        }  
        console.log(summary)
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
                case "Green Party":
                m.shortparty = 'Green';
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
        return (members);
    }), function(error) {console.log('fetch votes ' + error)};
}



export async function render(config) {
    const divisionurl = config.divisionurl;
    await getMembers(divisionurl);
    var html = mustache.render(mainTemplate,members,partialTemplates);
    return html;
}