import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { textos } from "../../style/style";
export default class HomePage extends Component {
	render() {
		return (
			<ScrollView style={{ flex: 1 }}>
				<View style={{}}>
					<Text style={[textos.titulos, textos.blue]}>¡Hola!</Text>
					<Text style={{ marginVertical: 10, fontSize: 16, textAlign: "center", fontFamily: "Raleway-Bold", }}>Elige una opción</Text>
					<Text style={{ marginBottom: 30, marginTop: 10, fontSize: 18, fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center" }}>¿Necesitas un servicio?</Text>
					<TouchableOpacity onPress={() => this.props["navigation"].navigate('BeneficiosCliente')}
						style={{ height: 70, borderWidth: 1, borderColor: "silver", alignItems: "center", borderRadius: 5, marginHorizontal: 20, marginBottom: 50, flexDirection: "row", backgroundColor: "#EDF7F9" }}>
						<Image source={require('../../assets/iconos/eres_cliente.png')} style={{ width: 51, height: 50, flex: 0, padding: 10, marginLeft: 10, }} />
						<Text style={{ fontSize: 16, fontFamily: "Raleway-Bold", marginLeft: 15, marginRight: 50, flex: 0.7, color: "#5AA5B9" }}>Eres Cliente</Text>
						<Image source={require('../../assets/iconos/continuar.png')} style={{ width: 16, height: 23, flex: 0, marginRight: -50 }} />
					</TouchableOpacity>
				</View>
				<View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<Text style={{ marginTop: 35, marginBottom: 35, fontSize: 18, fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center" }}>¿Quieres ofrecer un servicio?</Text>
					<TouchableOpacity onPress={() => this.props["navigation"].navigate('BeneficiosFixperto', { type: "profesional" })}
						style={{ height: 70, borderWidth: 1, borderColor: "silver", alignItems: "center", borderRadius: 5, marginHorizontal: 20, marginBottom: 30, flexDirection: "row", backgroundColor: "#EDF7F9" }}>
						<Image source={require('../../assets/iconos/eres_independiente.png')} style={{ width: 50, height: 39, flex: 0, padding: 10, marginLeft: 10, }} />
						<Text style={{ fontSize: 16, fontFamily: "Raleway-Bold", marginLeft: 15, marginRight: 50, flex: 0.7, color: "#5AA5B9" }}>Eres Independiente</Text>
						<Image source={require('../../assets/iconos/continuar.png')} style={{ width: 16, height: 23, flex: 0, marginRight: -50 }} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.props["navigation"].navigate('BeneficiosFixperto', { type: "empresa" })}
						style={{ height: 70, borderWidth: 1, borderColor: "silver", alignItems: "center", borderRadius: 5, marginHorizontal: 20, marginBottom: 50, flexDirection: "row", backgroundColor: "#EDF7F9" }}>
						<Image source={require('../../assets/iconos/eres_empresa.png')} style={{ width: 50, height: 49, flex: 0, padding: 10, marginLeft: 10 }} />
						<Text style={{ fontSize: 16, fontFamily: "Raleway-Bold", marginLeft: 15, marginRight: 50, flex: 0.7, color: "#5AA5B9" }}>Eres Empresa</Text>
						<Image source={require('../../assets/iconos/continuar.png')} style={{ width: 16, height: 23, flex: 0, marginRight: -50, }} />
					</TouchableOpacity>
				</View>
			</ScrollView>

		);
	}
}