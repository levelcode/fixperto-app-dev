import React, { Component } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import Region from "../../../../componentes/regionVista";
export default class RegistroProfesional4Vista extends Component {
	constructor(props) { super(props); this.state = { selected: false } }
	selected = selected => { this.setState({ selected }); }
	render() {
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<View style={{ backgroundColor: "silver" }}>
					<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 3 de 5</Text>
				</View>
				<View style={{ display: (this.state["selected"]) ? "none" : "flex" }}>
					<Text style={{ textAlign: "center", marginVertical: 5, fontFamily: "Raleway-Bold", color: "#36425C" }}>Cobertura</Text>

					<View style={{ flex: 1, flexDirection: "row", alignItems: "center", marginHorizontal: 20 }}>
						<Image source={require("../../../../assets/iconos/ubicacion.png")} style={{ width: 30, height: 30 }} />
						<Text style={{ flex: 0.9, marginLeft: 5 }}>Elige las ciudades donde ofrecerás tus servicios *</Text>
					</View>
				</View>

				<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
					<Text style={[{ fontFamily: "Raleway-Italic", fontSize : 13, color : "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
				</View>
				
				<Region ruta="RegistroProfesional2" navigation={this.props["navigation"]} single={false} type="pro" selected={this.selected} />
			</ScrollView >
		)
	}
}
