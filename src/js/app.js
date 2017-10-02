import axios from 'axios'
import xmlparse from 'pixl-xml'
import mustache from 'mustache'
import tableTemplate from '!raw-loader!./../templates/table.html'

var table = document.querySelector(".gv-table")
var divisiondiv = document.querySelector(".gv-data-rows");
var searchEl = document.getElementById("search-field");
var headers = document.querySelectorAll(".gv-header")
var headerrow = document.querySelector(".gv-headers")


function sortcolumns(){console.log('sorting')}

var members = [], currentSort, lastSorted;

function initsearch() {
    
    //  searchEl.addEventListener("keyup", function() {console.log('sausage')});
    searchEl.addEventListener("keyup", function () { render() });
    searchEl.addEventListener("focus", function () {
        if (this.value === "Search") {
            this.value = "";
        }
    });
    searchEl.addEventListener("blur", function () {
        if (this.value === "") {
            this.value = "Search";
        }
    });
    headerrow.addEventListener("click", function() {console.log('34343')});
    
}

function isDev() {
    var url = window.top.location.hostname;
    if (url.search('localhost') >= 0) {
        return true;
    } else { return false };
}

if (isDev) {
    var divisionurl = "http://hansard.services.digiminster.com/Divisions/Division/1192.xml";
} else {
    var embed = document.querySelector(".element.element-embed");
    var voteid = embed.getAttribute('data-alt');
}

function searchmatch(member) {
    console.log(member.Name.indexOf(searchEl.value));
    if ( member.Name.indexOf(searchEl.value) > -1 || member.Constituency.indexOf(searchEl.value) > -1 || member.Party.indexOf(searchEl.value) > -1 )
    { return true }
    else
    { return false }
}


function render() {
    console.log(searchEl.value);
    var memberstoshow = (searchEl.value !== "Search" && searchEl.value !== "") ? members.filter(searchmatch) : members;
    var tablehtml = mustache.render(tableTemplate, memberstoshow);
    divisiondiv.innerHTML = tablehtml;
    /* FAILED ATTEMPT TO REMOVE NEEDLESS EXTRA DIV AND APPEND ROWS DIRECTLY TO THE TABLE
    var tablerows = document.querySelectorAll(".gv-row");
    [].slice.apply(tablerows).forEach(function(r){
        table.appendChild(r);
    }
      )
*/
  
  
}


axios(divisionurl, { responseType: 'text' }).then(function (response) {
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
    })
    render(members);
});


initsearch();


