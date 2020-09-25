import React, { Component } from 'react';
import StatusOferta from "../../../componentes/statusOfertaVista";
export default class StatusCompletadoOfertaVista extends Component {
	render() { return (<StatusOferta offert={this.props["navigation"].getParam("item")} type="completed" />) }
}