import React, { Component } from 'react';
import StatusSolicitud from "../../../../componentes/statusSolicitudVista";
export default class StatusAgendadoSolicitudVista extends Component {
	render() { return (<StatusSolicitud request={this.props["navigation"].getParam("item")} type="scheduled" />) }
}