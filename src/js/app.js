import axios from 'axios'
import xmlparse from 'pixl-xml'
import mustache from 'mustache'
import tableTemplate from '!raw-loader!./../templates/table.html'
import votes from './../assets/votes.json'

var members = votes;

var tablebody = document.querySelector(".gv-table-body");
var table = document.querySelector(".gv-table");
var divisiondiv = document.querySelector(".gv-division");
var searchEl = document.getElementById("search-field");
var headers = document.querySelectorAll(".gv-header")
var headerrow = document.querySelector(".gv-headers")


function sortcolumns() { console.log('sorting') }

var lastcriterion, lastSorted;
var reverse = false;

function initsearch() {
    console.log('dsiodsuiods')
    searchEl.addEventListener("keyup", function () { 
        render() });
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
}

function sortColumns(e) {
    var criterion;
    if (e.target.textContent == 'MP') {
        criterion = "Name"
    } else if (e.target.textContent == "Vote") {
        criterion = "vote"
    } else { criterion = e.target.textContent };
    //sorting new column
    if (lastcriterion !== criterion) {
       reverse = true;
        members.sort(ordermembers(criterion))
    }
    //sorting same column but reversing the order
    else if (lastcriterion == criterion && reverse == true) {
        reverse = false;
        members.sort(ordermembers(criterion)).reverse()
    }
    //sorting the same column but reverting to straight order
    else if (lastcriterion == criterion && reverse == false) {
        reverse = true;
        members.sort(ordermembers(criterion));
    }
    lastcriterion = criterion;
    render();
}

function ordermembers(criterion) {
    return function (a, b) {
        if (a[criterion] < b[criterion]) { return -1 };
        if (b[criterion] < a[criterion]) { return 1 };
        if (b[criterion] == a[criterion]) { return 0 };
    }
}

function searchmatch(member) {
    if (member.Name.indexOf(searchEl.value) > -1 || member.Constituency.indexOf(searchEl.value) > -1 || member.Party.indexOf(searchEl.value) > -1)
    { return true }
    else
    { return false }
}


function render() {
    console.log(searchEl.value);
    var memberstoshow = (searchEl.value !== "Search" && searchEl.value !== "") ? members.filter(searchmatch) : members;
    var tablehtml = mustache.render(tableTemplate, memberstoshow);
    tablebody.innerHTML = tablehtml;
}

function initsort() {
headerrow.addEventListener("click", sortColumns);
}

//render();
initsearch();
initsort();