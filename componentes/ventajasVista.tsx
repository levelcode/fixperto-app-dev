import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

export default class VentajasVista extends Component {
	constructor(props) { super(props) }
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: "#273861" }}>
				<View style={{ flexDirection: "row", marginVertical: 20, marginHorizontal: 25, alignItems: "center" }}>
					<Ionicons name="ios-settings" size={40} color="#FFFFFF" />
					<Text style={{ fontFamily: "Raleway-Bold", color: "#FFFFFF", fontSize: 15, marginStart: 5 }}>Conoce las ventajas de ser {"\n"}  parte de nuestra red {"\n"}  de ﬁxpertos</Text>
				</View>
				<ScrollView style={{ marginHorizontal: 25 }}>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>Como empresa tenemos un compromiso con el país, y nuestro enfoque es el avance socioeconómico de nuestro expertos.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>No hacemos retención porcentual de los costos de tus servicios.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>No exigimos horario ni zonas de ejecución.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>Capacitaremos a nuestros expertos para aumentar sus competencias laborales.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>Expertos categorizados por rubos y zonas para servicios más inmediatos.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>Sistema de reviews para la seleccion orientada.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10, alignItems: "center" }}>
						<Ionicons name="ios-radio-button-on" size={15} color="#FFFFFF" />
						<Text style={{ marginStart: 10, color: "#FFFFFF" }}>Contacto directo entre cliente y experto.</Text>
					</View>
				</ScrollView>
				<View style={{ marginHorizontal: 25, marginBottom: 25 }}>
					<Button title="CONTINUAR" buttonStyle={{ backgroundColor: "#42AECB" }}
						titleStyle={{ fontFamily: "Raleway-Bold" }} onPress={() => this.props["navigation"].navigate('BeneficiosFixperto', { type: this.props["navigation"].getParam("type") })}
					/>
				</View>
			</View>
		)
	}
}