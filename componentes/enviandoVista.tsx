import React, { Component } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';

export default class EnviandoVista extends Component {
	constructor(props) { super(props) }
	componentDidMount() {
		setTimeout(() => { this.props["navigation"].navigate(this.props["navigation"].getParam("ruta")) }, 5000);
	}
	render() {
		const { width } = Dimensions.get('window');
		return (
			<View style={{ flex: 1, backgroundColor: "#1B263D", flexDirection : "column", alignItems: "center", justifyContent : "center"}}>
				<Image source={require("../assets/fondo.gif")}  style={{ width, height: 250, }} />
				
				{(this.props["navigation"].getParam("name")) ?
					<View style={{  justifyContent: "center" }}>
						<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", color: "#FFFFFF", fontSize: 20 }}>Hola {this.props["navigation"].getParam("name")}</Text>
						<Text style={{ textAlign: "center", marginHorizontal: 15, color: "#FFFFFF", marginTop: 5, fontSize: 15 }}>Tu solicitud ha sido enviada con éxito a nuestros ﬁxpertos</Text>
					</View>
					:
					<View style={{ justifyContent: "center" }}>
						<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", color: "#FFFFFF", fontSize: 20 }}>Tu registro ha sido exitoso</Text>
					</View>
				}
			</View>
		)
	}
}