import mainTemplate from './src/templates/main.html!text'
import axios from 'axios'
import xmlparse from 'pixl-xml'
import mustache from 'mustache'

export async function render() {
    
    var html = mustache.render(mainTemplate);
    
    return html;
}
