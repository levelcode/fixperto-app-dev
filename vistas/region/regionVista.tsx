import React, { Component } from "react";
import Region from "../../componentes/regionVista";
export default class RegionVista extends Component {
	constructor(props) { super(props); }
	render() { return (<Region ruta="NuevaSolicitud" navigation={this.props["navigation"]} single />) }
}
