import mainTemplate from './src/templates/main.html!text'
import tableTemplate from './src/templates/table.html!text'
import chartTemplate from './src/templates/chart.html!text'
import axios from 'axios'
import xmlparse from 'pixl-xml'
import mustache from 'mustache'
import syncrequest from 'sync-request'
import http from 'http'
import fs from 'fs'
//import cleannumber from 'sean-utils'
import {cleannumber, twodecimals} from './js/lib/utils'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var members, summary;

var partialTemplates = {
    "table" : tableTemplate,
    "chart" : chartTemplate
}




async function getMembers (divisionurl) {

    await axios(divisionurl, { responseType: 'text'}).then(function (response) {
        var data = xmlparse.parse(response.data);
        fs.writeFileSync("./src/assets/data.json",JSON.stringify(data));
        summary = {
            "for" : cleannumber(data.Division.AyeCount) + 2,
            "against" : cleannumber(data.Division.NoeCount) + 2
        }  
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
            m.Party == "Liberal Democrat" ? m.partyclass = "ld" : m.partyclass = m.shortparty;
        })
        summary.ayesbreakdown = {
            "Lab": ayes.filter(function(m){ return m.shortparty == "Lab" }).length,
            "Con": ayes.filter(function(m){ return m.shortparty == "Con" }).length,
            "LD": ayes.filter(function(m){ return m.shortparty == "Lib Dem" }).length,
            "SNP": ayes.filter(function(m){ return m.shortparty == "SNP" }).length,
            "Plaid": ayes.filter(function(m){ return m.shortparty == "Plaid" }).length,
            "DUP": ayes.filter(function(m){ return m.shortparty == "DUP" }).length,                   
            "Other": ayes.filter(function(m) {return ["Lab","Con","Lib Dem","SNP","Plaid","DUP"].includes(m.shortparty) == false}).length                
            
        }
        summary.noesbreakdown = {
            "Lab": noes.filter(function(m){ return m.shortparty == "Lab" }).length,
            "Con": noes.filter(function(m){ return m.shortparty == "Con" }).length,
            "LD": noes.filter(function(m){ return m.shortparty == "Lib Dem" }).length,
            "SNP": noes.filter(function(m){ return m.shortparty == "SNP" }).length,
            "Plaid": noes.filter(function(m){ return m.shortparty == "Plaid" }).length,
            "DUP": noes.filter(function(m){ return m.shortparty == "DUP" }).length,                
            "Other": noes.filter(function(m) {return ["Lab","Con","Lib Dem","SNP","Plaid","DUP"].includes(m.shortparty) == false}).length                
        }
        summary.ayespercent = getPercents(summary.ayesbreakdown);
        summary.noespercent = getPercents(summary.noesbreakdown);
    


        fs.writeFileSync("./src/assets/summary.json",JSON.stringify(summary));        
        fs.writeFileSync("./src/assets/votes.json",JSON.stringify(members));
        return (members,summary);
    }), function(error) {console.log('fetch votes ' + error)};
}

function getPercents(breakdown) {
    var allvotes = summary.for + summary.against;
    var percents = {};
    Object.assign(percents,breakdown);
    percents = Object.entries(percents).map(function(p) {
        return { party : p[0], percent :   twodecimals(100 * (p[1]/allvotes)) };
    });
    return percents;
}

export async function render(config) {
    const divisionurl = config.divisionurl;
    await getMembers(divisionurl);
    var templatedata = {members,summary}
    var html = mustache.render(mainTemplate,templatedata,partialTemplates);
    return html;
}