import React, {Component} from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import './main.scss';
import {Nav, Navbar} from 'react-bootstrap';
import {FaSearch} from "react-icons/fa";
import {Button} from "react-bootstrap/Button";

class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            miestas: 'kaunas',
            full_weather_data: [],
            rodoma_data: '',
            laikinas_miestas: 'kaunas',
            places: []
        };


        this.handleDienosPakeitimas = this.handleDienosPakeitimas.bind(this);
        this.handleChangeMiestas = this.handleChangeMiestas.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    componentDidMount() {
        fetch(`https://api.meteo.lt/v1/places/${this.state.miestas}/forecasts/long-term`)
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    full_weather_data: response.forecastTimestamps,
                })
            });
        fetch(`https://api.meteo.lt/v1/places/`)
            .then(response => response.json())
            .then((response) => {
                this.setState({
                    places: response,
                })
            });

    }

    handleSubmit(event){


        let galimi_miestai = [];
        for(let i of this.state.places){
            galimi_miestai.push(i.code)
        }
        console.log(this.state.places);
        console.log(galimi_miestai);

        event.preventDefault();

        let update = this.state.laikinas_miestas;

        if(galimi_miestai.includes(update.toLowerCase())){

            this.setState({
                miestas: update
            });
            fetch(`https://api.meteo.lt/v1/places/${update}/forecasts/long-term`)
                .then(response => response.json())
                .then((response) => {
                    try{
                        this.setState({
                            full_weather_data: response.forecastTimestamps,
                        })
                    }
                    catch(err){
                        console.log(err)
                    }
                });
        }
        else{
            alert("tokio miesto nera")
        }
}

    handleChangeMiestas(event){

        this.setState({
            laikinas_miestas: event.target.value,
        });

    }


    handleDienosPakeitimas(diena) {
        console.log(this.state.rodoma_data);
        let update = [];
        for (let i of this.state.full_weather_data) {
            if (i.forecastTimeUtc.substr(5, 6) === diena) {
                update.push(i)
            }
        }
        this.setState({
            rodoma_data : update,
        })
    }


    render() {

        let days_from_api = [];

        for (let i of this.state.full_weather_data) {
            days_from_api.push(i.forecastTimeUtc.substr(5, 6));
        }
        let unikalios_dienos = Array.from(new Set(days_from_api));

        var siandienos_listas_su_info = [];
        for (let i of this.state.full_weather_data) {
            if (i.forecastTimeUtc.substr(5, 6) === unikalios_dienos[0]) {
                siandienos_listas_su_info.push(i)
            }
        }
        let today_date = new Date();
        var days = ['Sekmadienis', 'Pirmadienis', 'Antradienis', 'Treciadienis', 'Ketvirtadienis', 'Penktadienis', 'Sestadienis'];

        if(!this.state.rodoma_data){
           var data = <Row>{siandienos_listas_su_info.map((item) =>
                   <Col className="px-0 px-sm-2" key={item.idCategory}>
                       <Card className="mx-auto my-1" style={{ width: '18rem'}} >
                           <Card.Body>
                               <Card.Title>{item.forecastTimeUtc}</Card.Title>
                               <Card.Text>
                                   temperatura:
                                   {item.airTemperature}
                                   debesuotumas:
                                   {item.cloudCover}
                                   salygos:
                                   {item.conditionCode}
                               </Card.Text>
                           </Card.Body>
                       </Card>
                   </Col>
               )}
           </Row>
        }
        else{
            var data = <Row>{this.state.rodoma_data.map((item) =>
                <Col className="px-0 px-sm-2" key={item.idCategory}>
                    <Card className="mx-auto my-1" style={{ width: '18rem'}} >
                        <Card.Body>
                            <Card.Title>{item.forecastTimeUtc}</Card.Title>
                            <Card.Text>
                                temperatura:
                                {item.airTemperature}
                                debesuotumas:
                                {item.cloudCover}
                                salygos:
                                {item.conditionCode}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )}
            </Row>
        }

        if(this.state.full_weather_data === []){
            return <div>Loading...</div>
        }
        else {
            return (
                <main>
                    <Container>
                        <Row className="bg-primary">

                            <form className="bd-dark" onSubmit={this.handleSubmit}>
                                <label className="mx-3 h3 text-light">WEATHER</label>
                                <input type="text" value ={this.state.laikinas_miestas} placeholder="Enter a city" onChange={this.handleChangeMiestas}/>
                                <input type="submit" value="Tikrinti orus"/>

                            </form>
                        </Row>
                        <Row>
                            <Navbar bg="light">
                                <Navbar.Brand>{this.state.miestas.toUpperCase()} : {days[today_date.getDay()]}</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                                    <Nav>
                                        {unikalios_dienos.map((diena) =>
                                            <Nav.Link onClick={() =>this.handleDienosPakeitimas(diena)}>{diena}</Nav.Link>
                                        )}
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>
                        </Row>
                        {data}
                    </Container>
                </main>
            );
        }
    }
}


export default Main
