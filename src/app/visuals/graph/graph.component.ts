import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, AfterViewInit } from '@angular/core';
import { D3Service, ForceDirectedGraph, Tree, Node } from '../../d3';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height">
      <g transform="translate(0, 0)"></g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  @Input('nodes') nodes;
  @Input('links') links;
  graph: Tree;
  team = [
    {
      "uid": "6067443",
      "name": "Hector Martinez Alonso",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "+1 (416) 607-1644",
      "email": "Hector.MartinezAlonso@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "amir-hajian",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6067443",
      "photo": "/assets/images/people/hector-martinez-alonso.png",
      "basename": "hector-martinez-alonso"
    },
    {
      "uid": "0212502",
      "name": "Khalid Al-Kofahi",
      "title": "VP, Research",
      "level": "0",
      "telephone_number": "+1 (416) 607-1523",
      "email": "khalid.al-kofahi@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "top",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0212502",
      "photo": "/assets/images/people/khalid-al-kofahi.png",
      "basename": "khalid-al-kofahi"
    },
    {
      "uid": "0052183",
      "name": "Frank Schilder",
      "title": "Director, Research",
      "level": "1",
      "telephone_number": "+1 (651) 848-7294",
      "email": "frank.schilder@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0052183",
      "photo": "/assets/images/people/frank-schilder.png",
      "basename": "frank-schilder"
    },
    {
      "email": "Khaled.Ammar@thomsonreuters.com",
      "level": "-1",
      "location": "Toronto",
      "name": "Khaled Ammar",
      "photo": "/assets/images/people/khaled-ammar.png",
      "profile": "https://thehub.thomsonreuters.com/people/6035886",
      "reports_to": "khalid-al-kofahi",
      "telephone_number": "",
      "title": "Research Engineer",
      "uid": "6035886",
      "preview": "",
      "basename": "khaled-ammar"
    },
    {
      "uid": "0105622",
      "name": "Jochen Leidner",
      "title": "Director, Research",
      "level": "1",
      "telephone_number": "",
      "email": "jochen.leidner@thomsonreuters.com",
      "location": "London",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0105622",
      "photo": "/assets/images/people/jochen-leidner.png",
      "basename": "jochen-leidner"
    },
    {
      "email": "gary.berosik@thomsonreuters.com",
      "level": "-1",
      "location": "Eagan",
      "name": "Gary Berosik",
      "photo": "/assets/images/people/gary-berosik.png",
      "profile": "https://thehub.thomsonreuters.com/people/0000259",
      "reports_to": "bill-keenan",
      "telephone_number": "+1 (651) 687-1891",
      "title": "Lead Business Systems Analyst",
      "uid": "0000259",
      "preview": "",
      "basename": "gary-berosik"
    },
    {
      "uid": "6026978",
      "name": "Armineh Nourbakhsh",
      "title": "Research Scientist",
      "level": "1",
      "telephone_number": "+1 (646) 223-4340",
      "email": "Armineh.Nourbakhsh@thomsonreuters.com",
      "location": "New York",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6026978",
      "photo": "/assets/images/people/armineh-nourbakhsh.png",
      "basename": "armineh-nourbakhsh"
    },
    {
      "uid": "6032438",
      "name": "Amir Hajian",
      "title": "Director, Research",
      "level": "1",
      "telephone_number": "+1 (416) 687-7522",
      "email": "Amir.Hajian@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6032438",
      "photo": "/assets/images/people/amir-hajian.png",
      "basename": "amir-hajian"
    },
    {
      "uid": "6062365",
      "name": "Afsaneh Fazly",
      "title": "Director, Research",
      "level": "1",
      "telephone_number": "+1 (416) 607-1578",
      "email": "Afsaneh.Fazly@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6062365",
      "photo": "/assets/images/people/afsaneh-fazly.png",
      "basename": "afsaneh-fazly"
    },
    {
      "uid": "6066619",
      "name": "Chong Wang",
      "title": "Research Scientist",
      "level": "1",
      "telephone_number": "",
      "email": "Chong.Wang@thomsonreuters.com",
      "location": "New York",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6066619",
      "photo": "/assets/images/people/chong-wang.png",
      "basename": "chong-wang"
    },
    {
      "uid": "6014842",
      "name": "Gayle McElvain",
      "title": "Sr. Research Scientist",
      "level": "2",
      "telephone_number": "+1 (651) 848-4402",
      "email": "gayle.mcelvain@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "tonya-custis",
      "denial": "TRUE",
      "profile": "https://thehub.thomsonreuters.com/people/6014842",
      "photo": "/assets/images/people/gayle-mc-elvain.png",
      "basename": "gayle-mc-elvain"
    },
    {
      "uid": "6020643",
      "name": "Conner Cowling",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "+1 (651) 687-4805",
      "email": "Conner.Cowling@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6020643",
      "photo": "/assets/images/people/conner-cowling.png",
      "basename": "conner-cowling"
    },
    {
      "uid": "0041019",
      "name": "Carol Steele",
      "title": "Machine Learning Test Data Management Lead",
      "level": "4",
      "telephone_number": "+1 (651) 687-8955",
      "email": "Carol.Steele@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "tom-zielund",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0041019",
      "photo": "/assets/images/people/carol-steele.png",
      "basename": "carol-steele"
    },
    {
      "uid": "6026861",
      "name": "Bob Arens",
      "title": "Research Scientist-2",
      "level": "2",
      "telephone_number": "+1 (651) 687-4897",
      "email": "Bob.Arens@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6026861",
      "photo": "/assets/images/people/bob-arens.png",
      "basename": "bob-arens"
    },
    {
      "uid": "0155811",
      "name": "George Sanchez",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "+1 (651) 687-7467",
      "email": "george.sanchez@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "arun-vachher",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0155811",
      "photo": "/assets/images/people/george-sanchez.png",
      "basename": "george-sanchez"
    },
    {
      "uid": "6041561",
      "name": "Filippo Pompili",
      "title": "Research Scientist - NLP",
      "level": "2",
      "telephone_number": "+1 (416) 607-1513",
      "email": "Filippo.Pompili@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6041561",
      "photo": "/assets/images/people/filippo-pompili.png",
      "basename": "filippo-pompili"
    },
    {
      "uid": "0077980",
      "name": "Hiroko Bretz",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "+1 (651) 687-2087",
      "email": "hiroko.bretz@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "arun-vachher",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0077980",
      "photo": "/assets/images/people/hiroko-bretz.png",
      "basename": "hiroko-bretz"
    },
    {
      "uid": "0041298",
      "name": "Kajsa Anderson",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "+1 (651) 848-8961",
      "email": "kajsa.anderson@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "arun-vachher",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0041298",
      "photo": "/assets/images/people/kajsa-anderson.png",
      "basename": "kajsa-anderson"
    },
    {
      "uid": "6040893",
      "name": "Ashwini Chanagoudar",
      "title": "Java Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "Ashwini.Chanagoudar@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6040893",
      "photo": "/assets/images/people/ashwini-chanagoudar.png",
      "basename": "ashwini-chanagoudar"
    },
    {
      "uid": "6046616",
      "name": "Jia Gu",
      "title": "Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "Jia.Gu@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "taimur-javed",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6046616",
      "photo": "/assets/images/people/jia-gu.png",
      "basename": "jia-gu"
    },
    {
      "uid": "6065949",
      "name": "Julian Brooke",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "+1 (416) 607-1617",
      "email": "Julian.Brooke@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "afsaneh-fazly",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6065949",
      "photo": "/assets/images/people/julian-brooke.png",
      "basename": "julian-brooke"
    },
    {
      "uid": "6044257",
      "name": "Fabio Petroni",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "",
      "email": "Fabio.Petroni@thomsonreuters.com",
      "location": "London",
      "reports_to": "jochen-leidner",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6044257",
      "photo": "/assets/images/people/fabio-petroni.png",
      "basename": "fabio-petroni"
    },
    {
      "uid": "0021242",
      "name": "Hugo Molina-Salgado",
      "title": "Sr. Research Scientist",
      "level": "2",
      "telephone_number": "+1 (651) 848-2662",
      "email": "hugo.salgado@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "frank-schilder",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0021242",
      "photo": "/assets/images/people/hugo-molina-salgado.png",
      "basename": "hugo-molina-salgado"
    },
    {
      "uid": "0027598",
      "name": "Jack Conrad",
      "title": "Lead Research Scientist",
      "level": "2",
      "telephone_number": "+1 (651) 848-5180",
      "email": "jack.g.conrad@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "frank-schilder",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0027598",
      "photo": "/assets/images/people/jack-conrad.png",
      "basename": "jack-conrad"
    },
    {
      "uid": "6046136",
      "name": "Kanika Madan",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "",
      "email": "Kanika.Madan@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "afsaneh-fazly",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6046136",
      "photo": "/assets/images/people/kanika-madan.png",
      "basename": "kanika-madan"
    },
    {
      "uid": "6021870",
      "name": "Charese Smiley",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "+1 (651) 687-5557",
      "email": "charese.smiley@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "frank-schilder",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6021870",
      "photo": "/assets/images/people/charese-smiley.png",
      "basename": "charese-smiley"
    },
    {
      "uid": "6063526",
      "name": "Elnaz Davoodi",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "",
      "email": "Elnaz.Davoodi@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "frank-schilder",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6063526",
      "photo": "/assets/images/people/elnaz-davoodi.png",
      "basename": "elnaz-davoodi"
    },
    {
      "uid": "6015486",
      "name": "Dezhao Song",
      "title": "Sr. Research Scientist",
      "level": "2",
      "telephone_number": "",
      "email": "dezhao.song@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "frank-schilder",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6015486",
      "photo": "/assets/images/people/dezhao-song.png",
      "basename": "dezhao-song"
    },
    {
      "uid": "0212726",
      "name": "John Duprey",
      "title": "Sr. Architect",
      "level": "2",
      "telephone_number": "+1 (585) 627-2409",
      "email": "john.duprey@thomsonreuters.com",
      "location": "Rochester",
      "reports_to": "bill-keenan",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0212726",
      "photo": "/assets/images/people/john-duprey.png",
      "basename": "john-duprey"
    },
    {
      "uid": "0213165",
      "name": "Arun Vachher",
      "title": "Director, Technology",
      "level": "2",
      "telephone_number": "+1 (651) 848 5881",
      "email": "arun.vachher@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "bill-keenan",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0213165",
      "photo": "/assets/images/people/arun-vachher.png",
      "basename": "arun-vachher"
    },
    {
      "uid": "0032706",
      "name": "Bill Keenan",
      "title": "Sr. Director, Technology",
      "level": "1",
      "telephone_number": "+1 (585) 627-2516",
      "email": "william.keenan@thomsonreuters.com",
      "location": "Rochester",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0032706",
      "photo": "/assets/images/people/bill-keenan.png",
      "basename": "bill-keenan"
    },
    {
      "uid": "6042381",
      "name": "Domingo Huh",
      "title": "UX Visual Designer",
      "level": "2",
      "telephone_number": "+1 (416) 607-1516",
      "email": "Domingo.Huh@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "bill-keenan",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042381",
      "photo": "/assets/images/people/domingo-huh.png",
      "basename": "domingo-huh"
    },
    {
      "uid": "6042522",
      "name": "Carter Kolbeck",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "+1 (416) 687-7341",
      "email": "Carter.Kolbeck@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "amir-hajian",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042522",
      "photo": "/assets/images/people/carter-kolbeck.png",
      "basename": "carter-kolbeck"
    },
    {
      "uid": "6068394",
      "name": "Kelvin Chan",
      "title": "Senior UX Designer",
      "level": "2",
      "telephone_number": "",
      "email": "Kelvin.Chan@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "bill-keenan",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6068394",
      "photo": "/assets/images/people/kelvin-chan.png",
      "basename": "kelvin-chan"
    },
    {
      "uid": "6042446",
      "name": "Ali Gorji",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "",
      "email": "Ali.Gorji@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "amir-hajian",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042446",
      "photo": "/assets/images/people/ali-gorji.png",
      "basename": "ali-gorji"
    },
    {
      "uid": "6040477",
      "name": "Zack Wise",
      "title": "Software Engineer",
      "level": "3",
      "telephone_number": "+1( 416) 607-1522",
      "email": "Zack.Wise@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6040477",
      "photo": "/assets/images/people/zack-wise.png",
      "basename": "zack-wise"
    },
    {
      "uid": "6042890",
      "name": "Taimur Javed",
      "title": "Manager, Software Development",
      "level": "2",
      "telephone_number": "+1 (416) 607-1520",
      "email": "Taimur.Javed@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "bill-keenan",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042890",
      "photo": "/assets/images/people/taimur-javed.png",
      "basename": "taimur-javed"
    },
    {
      "email": "sameena.shah@thomsonreuters.com",
      "level": "-1",
      "location": "New York",
      "name": "Sameena Shah",
      "photo": "/assets/images/people/sameena-shah.png",
      "profile": "https://thehub.thomsonreuters.com/people/0142245",
      "reports_to": "khalid-al-kofahi",
      "telephone_number": "+1 (646) 223-7342",
      "title": "Director, Research",
      "uid": "0142245",
      "preview": "",
      "basename": "sameena-shah"
    },
    {
      "email": "martin.hyndman@thomsonreuters.com",
      "level": "-1",
      "location": "Eagan",
      "name": "Martin Hyndman",
      "photo": "/assets/images/people/martin-hyndman.png",
      "profile": "https://thehub.thomsonreuters.com/people/4400312",
      "reports_to": "khalid-al-kofahi",
      "telephone_number": "+1 (651) 848-8131",
      "title": "Director, Research Technology Programs",
      "uid": "4400312",
      "preview": "",
      "basename": "martin-hyndman"
    },
    {
      "uid": "6065999",
      "name": "Raheleh Makki Niri",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "",
      "email": "Raheleh.MakkiNiri@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "afsaneh-fazly",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6065999",
      "photo": "/assets/images/people/raheleh-makki-niri.png",
      "basename": "raheleh-makki-niri"
    },
    {
      "uid": "6013842",
      "name": "Shawn Liu",
      "title": "Sr. Research Scientist",
      "level": "1",
      "telephone_number": "+1 (646) 223-8040",
      "email": "xiaomo.liu@thomsonreuters.com",
      "location": "New York",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6013842",
      "photo": "/assets/images/people/shawn-liu.png",
      "basename": "shawn-liu"
    },
    {
      "uid": "0065600",
      "name": "Russell Kociuba",
      "title": "Associate Architect",
      "level": "3",
      "telephone_number": "+1 (585) 627-2529",
      "email": "russell.kociuba@thomsonreuters.com",
      "location": "Rochester",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0065600",
      "photo": "/assets/images/people/russell-kociuba.png",
      "basename": "russell-kociuba"
    },
    {
      "uid": "0078185",
      "name": "Mark Vedder",
      "title": "Sr. Java Software Engineer",
      "level": "3",
      "telephone_number": "+1 (585) 627-2894",
      "email": "mark.vedder@thomsonreuters.com",
      "location": "Rochester",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0078185",
      "photo": "/assets/images/people/mark-vedder.png",
      "basename": "mark-vedder"
    },
    {
      "uid": "0081009",
      "name": "Robert Martin",
      "title": "Sr. Web Application Developer",
      "level": "3",
      "telephone_number": "+1(585) 327-6186",
      "email": "robertd.martin@thomsonreuters.com",
      "location": "Rochester",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0081009",
      "photo": "/assets/images/people/robert-martin.png",
      "basename": "robert-martin"
    },
    {
      "uid": "0081771",
      "name": "Merine Thomas",
      "title": "Associate Architect",
      "level": "3",
      "telephone_number": "+1 (651) 687-5523",
      "email": "merine.thomas@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0081771",
      "photo": "/assets/images/people/merine-thomas.png",
      "basename": "merine-thomas"
    },
    {
      "uid": "0165549",
      "name": "Steven Pomerville",
      "title": "Software Development Engineer",
      "level": "3",
      "telephone_number": "+1 (585) 327-6197",
      "email": "steven.pomerville@thomsonreuters.com",
      "location": "Rochester",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0165549",
      "photo": "/assets/images/people/steven-pomerville.png",
      "basename": "steven-pomerville"
    },
    {
      "uid": "0115286",
      "name": "Ronald Teo",
      "title": "Lead Software Engineer",
      "level": "3",
      "telephone_number": "+1 (651) 848-5659",
      "email": "ronald.teo@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "arun-vachher",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0115286",
      "photo": "/assets/images/people/ronald-teo.png",
      "basename": "ronald-teo"
    },
    {
      "uid": "6042928",
      "name": "Sean Lee",
      "title": "Web Application Developer",
      "level": "3",
      "telephone_number": "+1 (416) 607-1519",
      "email": "Sean.Lee@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "taimur-javed",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042928",
      "photo": "/assets/images/people/sean-lee.png",
      "basename": "sean-lee"
    },
    {
      "uid": "0063181",
      "name": "Natraj Raman",
      "title": "Sr. Research Engineer",
      "level": "2",
      "telephone_number": "+44 (020) 7542-4817",
      "email": "natraj.raman@thomsonreuters.com",
      "location": "London",
      "reports_to": "jochen-leidner",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0063181",
      "photo": "/assets/images/people/natraj-raman.png",
      "basename": "natraj-raman"
    },
    {
      "uid": "6046782",
      "name": "Luis Antunes",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "Luis.Antunes@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "taimur-javed",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6046782",
      "photo": "/assets/images/people/luis-antunes.png",
      "basename": "luis-antunes"
    },
    {
      "uid": "6065360",
      "name": "Sid Joshi",
      "title": "Web Application Developer",
      "level": "3",
      "telephone_number": "",
      "email": "Sid.Joshi@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "taimur-javed",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6065360",
      "photo": "/assets/images/people/sid-joshi.png",
      "basename": "sid-joshi"
    },
    {
      "uid": "6042895",
      "name": "Luna Feng",
      "title": "Software Engineer",
      "level": "3",
      "telephone_number": "+1 (416) 687-7522",
      "email": "Luna.Feng@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "taimur-javed",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042895",
      "photo": "/assets/images/people/luna-feng.png",
      "basename": "luna-feng"
    },
    {
      "uid": "0102180",
      "name": "Ramdev Wudali",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "+1 (651) 687-4922",
      "email": "ramdev.wudali@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "arun-vachher",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0102180",
      "photo": "/assets/images/people/ramdev-wudali.png",
      "basename": "ramdev-wudali"
    },
    {
      "uid": "6038466",
      "name": "Lisa Bender",
      "title": "Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "Lisa.Bender@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6038466",
      "photo": "/assets/images/people/lisa-bender.png",
      "basename": "lisa-bender"
    },
    {
      "uid": "6041674",
      "name": "Mike Willekes",
      "title": "Manager, Software Development",
      "level": "2",
      "telephone_number": "+1 (416) 687-7975",
      "email": "Mike.Willekes@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "bill-keenan",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6041674",
      "photo": "/assets/images/people/mike-willekes.png",
      "basename": "mike-willekes"
    },
    {
      "uid": "6067591",
      "name": "Richard Pito",
      "title": "Sr. Research Scientist",
      "level": "2",
      "telephone_number": "",
      "email": "richard.pito@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6067591",
      "photo": "/assets/images/people/richard-pito.png",
      "basename": "richard-pito"
    },
    {
      "uid": "6042078",
      "name": "Sean Matthews",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "",
      "email": "Sean.Matthews@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6042078",
      "photo": "/assets/images/people/sean-matthews.png",
      "basename": "sean-matthews"
    },
    {
      "uid": "6045913",
      "name": "Stephanie Hurtado",
      "title": "Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "Stephanie.Hurtado@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6045913",
      "photo": "/assets/images/people/stephanie-hurtado.png",
      "basename": "stephanie-hurtado"
    },
    {
      "uid": "6046308",
      "name": "Saro Migirdicyan",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "+1 (416) 607-1550",
      "email": "Saro.Migirdicyan@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6046308",
      "photo": "/assets/images/people/saro-migirdicyan.png",
      "basename": "saro-migirdicyan"
    },
    {
      "uid": "6046783",
      "name": "Taeyon Kim",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "+1 (416) 607-1558",
      "email": "Taeyon.Kim@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6046783",
      "photo": "/assets/images/people/taeyon-kim.png",
      "basename": "taeyon-kim"
    },
    {
      "uid": "6068203",
      "name": "Masoud Makrehchi",
      "title": "Lead Research Scientist",
      "level": "2",
      "telephone_number": "+1 (416) 607-1665",
      "email": "masoud.makrehchi@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6068203",
      "photo": "/assets/images/people/masoud-makrehchi.png",
      "basename": "masoud-makrehchi"
    },
    {
      "uid": "0045494",
      "name": "Thomas Zielund",
      "title": "Information Architect",
      "level": "3",
      "telephone_number": "+1 (651) 848-5995",
      "email": "tom.zielund@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0045494",
      "photo": "/assets/images/people/thomas-zielund.png",
      "basename": "thomas-zielund"
    },
    {
      "email": "vassilis.plachouras@thomsonreuters.com",
      "level": "-1",
      "location": "London",
      "name": "Vassilis Plachouras",
      "photo": "/assets/images/people/vassilis-plachouras.png",
      "profile": "https://thehub.thomsonreuters.com/people/6018369",
      "reports_to": "khalid-al-kofahi",
      "telephone_number": "+44 (020) 7542-7590",
      "title": "Lead Research Scientist",
      "uid": "6018369",
      "preview": "",
      "basename": "vassilis-plachouras"
    },
    {
      "uid": "6069095",
      "name": "Tate Avery",
      "title": "Lead Software Engineer",
      "level": "3",
      "telephone_number": "+1 (647) 214-0497",
      "email": "tate.avery@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "john-duprey",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6069095",
      "photo": "/assets/images/people/tate-avery.png",
      "basename": "tate-avery"
    },
    {
      "email": "tony.stark@thomsonreuters.com",
      "level": "-1",
      "location": "New York",
      "name": "Tony Stark",
      "photo": "/assets/images/people/tony-stark.png",
      "profile": "https://thehub.thomsonreuters.com/people/9999999",
      "reports_to": "khalid-al-kofahi",
      "telephone_number": "646-223-7342",
      "title": "Iron Man",
      "uid": "9999999",
      "preview": "",
      "basename": "tony-stark"
    },
    {
      "uid": "0159515",
      "name": "Thomas Vacek",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "+1 (651) 848-3786",
      "email": "thomas.vacek@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "frank-schilder",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0159515",
      "photo": "/assets/images/people/thomas-vacek.png",
      "basename": "thomas-vacek"
    },
    {
      "uid": "6026529",
      "name": "Timothy Nugent",
      "title": "Sr. Research Scientist",
      "level": "2",
      "telephone_number": "+44 (020) 7542-7588",
      "email": "Tim.Nugent@thomsonreuters.com",
      "location": "London",
      "reports_to": "jochen-leidner",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6026529",
      "photo": "/assets/images/people/timothy-nugent.png",
      "basename": "timothy-nugent"
    },
    {
      "uid": "0062356",
      "name": "Tonya Custis",
      "title": "Director, Research",
      "level": "1",
      "telephone_number": "+1 (651) 687-5336",
      "email": "tonya.custis@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "khalid-al-kofahi",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/0062356",
      "photo": "/assets/images/people/tonya-custis.png",
      "basename": "tonya-custis"
    },
    {
      "uid": "6041564",
      "name": "Vincent Tang",
      "title": "Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "Vince.Tang@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "mike-willekes",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6041564",
      "photo": "/assets/images/people/vincent-tang.png",
      "basename": "vincent-tang"
    },
    {
      "uid": "6046309",
      "name": "Wandee Lee",
      "title": "Project Manager",
      "level": "3",
      "telephone_number": "+1 (416) 607-1805",
      "email": "Wandee.Lee@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "arun-vachher",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6046309",
      "photo": "/assets/images/people/wandee-lee.png",
      "basename": "wandee-lee"
    },
    {
      "uid": "6041559",
      "name": "Wee Don Teo",
      "title": "Research Engineer",
      "level": "2",
      "telephone_number": "",
      "email": "Don.Teo@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6041559",
      "photo": "/assets/images/people/wee-don-teo.png",
      "basename": "wee-don-teo"
    },
    {
      "uid": "6068395",
      "name": "William Nguyen",
      "title": "Sr. Software Engineer",
      "level": "3",
      "telephone_number": "",
      "email": "william.nguyen@thomsonreuters.com",
      "location": "Toronto",
      "reports_to": "taimur-javed",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6068395",
      "photo": "/assets/images/people/william-nguyen.png",
      "basename": "william-nguyen"
    },
    {
      "uid": "6026806",
      "name": "Xin Shuai",
      "title": "Research Scientist",
      "level": "2",
      "telephone_number": "+1 (651) 687-7779",
      "email": "Xin.Shuai@thomsonreuters.com",
      "location": "Eagan",
      "reports_to": "tonya-custis",
      "denial": "",
      "profile": "https://thehub.thomsonreuters.com/people/6026806",
      "photo": "/assets/images/people/xin-shuai.png",
      "basename": "xin-shuai"
    }
  ];
  public root: any;
  treemap: any;
  svg: any;
  defs: any;
  private _options: { width, height } = { width: 800, height: 600 };
  i = 0;
  duration = 750;

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.graph.initSimulation(this.options);
  // }


  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    const groups = _.groupBy(this.team.filter(member => parseInt(member.level) > -1), member => member.reports_to);
    const root = groups.top[0];

    root.children = groups[_.kebabCase(root.name)].map(member => {
      member.children = groups[_.kebabCase(member.name)];
      if (member.children) {
        member.children.map(manager => {
          manager.children = groups[_.kebabCase(manager.name)];
          return manager;
        });
      }
      return member;
    });

    this.svg = d3.select('svg');
    this.defs = this.svg.append('defs');
    this.treemap = d3.tree().size([this.options.width, this.options.height]);

    this.root = d3.hierarchy(root, (d: any) => d.children);
    this.root.x0 = this.options.width / 2;
    this.root.y0 = 0;

    this.root.children.forEach(this.collapse);

    this.update(this.root);
  }

  update(source) {
    // Assigns the x and y position for the nodes
    const treeData = this.treemap(this.root);
    // Compute the new tree layout.
    const nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

    this.defs.selectAll('pattern').data(nodes).enter()
      .append('pattern')
      .attr('id', (d: any) => 'img_' + d.data.uid)
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternUnits', 'objectBoundingBox')
      .append('image')
      .attr('x', -20)
      .attr('y', 0)
      .attr('xlink:href', (d: any) => {
        return `http://dev.rdpresents.com.s3-website-us-east-1.amazonaws.com${d.data.photo}`;
      });

    // Normalize for fixed-depth.
    nodes.forEach((d: any) => {
      d.x = d.x + 0;
      d.y = d.depth * 200 + 80;
    });

    const node = this.svg.selectAll('g.node')
      .data(nodes, (d: any) => d.id || (d.id = ++this.i));

    // const tooltip = d3.select('body').append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0);

    // console.log(`root.x0: ${this.root.x0}, root.y0: ${this.root.y0}`);

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => 'translate(' + source.x0 + ',' + source.y0 + ')')
      .on('click', (d: any) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        this.update(source);
      });
      // .on('mouseover', (d: any) => {
      //   tooltip.transition()
      //     .duration(200)
      //     .style('opacity', .9);
      //   tooltip.html(d.data.title)
      //     .style('left', (d3.event.pageX) + 'px')
      //     .style('top', (d3.event.pageY - 28) + 'px');
      // })
      // .on('mouseout', function(d) {
      //   tooltip.transition()
      //     .duration(500)
      //     .style('opacity', 0);
      // });

    // Add Circle for the nodes
    nodeEnter.append('rect')
      .attr('class', 'node')
      .attr('width', 1e-6)
      .attr('height', 1e-6)
      .style('fill', (d: any) => {
        return d._children ? 'lightsteelblue' : '#e5e5e5';
      });

    // Add labels for the nodes
    nodeEnter.append('text')
      .attr('dy', '120')
      .attr('text-anchor', 'middle')
      .style('font-family', 'Arial')
      .style('font-size', '12px')
      .style('fill', '#ffffff')
      .text((d: any) => d.data.name);
    nodeEnter.append('text')
      .attr('dy', '140')
      .attr('text-anchor', 'middle')
      .style('font-family', 'Arial')
      .style('font-size', '12px')
      .style('fill', '#ffffff')
      .text((d: any) => d.data.title);

    // Add labels for the nodes
    // nodeEnter.append('text')
    //   .attr('dy', '2.5em')
    //   .attr('text-anchor', (d: any) => d.children || d._children ? 'middle' : 'middle')
    //   .text((d: any) => 'Senior Software Developer');

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(this.duration)
      .attr('transform', (d: any) => 'translate(' + d.x + ',' + d.y + ')');

    // Update the node attributes and style
    nodeUpdate.select('rect.node')
      .attr('x', -80)
      .attr('width', 160)
      .attr('height', 150)
      .style('fill', (d: any) => `url(#img_${d.data.uid})`)
      .style('stroke', (d: any) => d._children ? 'lightsteelblue' : 'lightgray')
      .style('stroke-width', 2)
      .attr('cursor', 'pointer');

    // Remove any exiting nodes
    const nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', (d) => 'translate(' + source.x + ',' + source.y + ')')
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('rect')
      .attr('width', 1e-6)
      .attr('height', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    const link = this.svg.selectAll('path.link')
      .data(links, (d: any) => d.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const o = {x: source.x0, y: source.y0};
        return diagonal(o, o);
      });

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', (d: any) => diagonal(d, d.parent))
      .attr('stroke', 'darkgray')
      .attr('fill', 'transparent');

    // Remove any exiting links
    const linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', (d: any) => {
        const o = {x: source.x, y: source.y};
        return diagonal(o, o);
      })
      .remove();

    // Store the old positions for transition.
    nodes.forEach((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      return `M ${s.x} ${s.y}
            L ${d.x} ${d.y + 150}`;
    }
  }

  collapse = (d) => {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  };

  get options() {
    return this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
}
