import React, { Component } from 'react';
import StatusSolicitud from "../../../../componentes/statusSolicitudVista";
export default class StatusCompletadoSolicitudVista extends Component {
	render() { return (<StatusSolicitud request={this.props["navigation"].getParam("item")} type="completed" />) }
}