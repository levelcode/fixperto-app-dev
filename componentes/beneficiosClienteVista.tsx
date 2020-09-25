import React, { Component } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { buttons, textos } from "../style/style";

export default class BeneficiosClienteVista extends Component {
	constructor(props) { super(props) }
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<Text style={[textos.titulos, textos.blue]}>Beneficios</Text>
				<Divider style={{ marginHorizontal: 0, marginBottom: 15, marginTop: 20 }} />
				<ScrollView style={{ marginHorizontal: 25 }}>
					<View style={{ flexDirection: "row", flex: 1, alignItems: "center", marginVertical: 15, }}>
						<Image source={require('../assets/iconos/beneficio1.png')} style={{ width: 90, height: 90 }} />
						<View style={{ marginStart: 10, flex: 0.8 }}>
							<Text style={{ textAlign: "left", fontSize: 15 }}>Consultas gratis e ilimitadas.</Text>
						</View>
					</View>
					<Divider style={{ marginTop: 20 }} />
					<View style={{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 20, marginVertical: 15, }}>
						<Image source={require('../assets/iconos/beneficio2.png')} style={{ width: 90, height: 90 }} />
						<View style={{ marginStart: 10, flex: 0.8 }}>
							<Text style={{ textAlign: "left", fontSize: 15 }}> Sistema de calificación del fixperto por recomendaciones y opiniones de clientes para una mejor elección.</Text>
						</View>
					</View>
					<Divider style={{ marginTop: 20 }} />
					<View style={{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 20, marginVertical: 15, }}>
						<Image source={require('../assets/iconos/beneficio3.png')} style={{ width: 90, height: 90 }} />
						<View style={{ marginStart: 10, flex: 0.8 }}>
							<Text style={{ textAlign: "left", fontSize: 15 }}>Cuenta personalizada, control e historial de tus servicios.</Text>
						</View>
					</View>
				</ScrollView>
				<Button title="CONTINUAR" buttonStyle={buttons.primary}
					titleStyle={buttons.PrimaryText} containerStyle={{}}
					onPress={() => this.props["navigation"].navigate('RegistroCliente')}
				/>
			</View>
		)
	}
}