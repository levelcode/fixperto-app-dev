import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Image, AsyncStorage, Text } from 'react-native';
export default class ComprarFixcoinVista extends Component {
	constructor(props) { super(props); this.state = { user: {}, handler: "", display: "none" } }
	componentDidMount() { AsyncStorage.getItem("@USER").then((user) => { this.setState({ user: JSON.parse(user) }); }) }
	render() {
		const { user } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<Text style={{ marginHorizontal: 20, marginVertical: 15, fontSize: 15, fontFamily: "Raleway-Bold", textAlign: "center", color: "#283B64" }}>Estos son los datos de la compra</Text>
				<View style={{ marginBottom: 15, padding: 10, marginHorizontal: 10, borderWidth: 0.5, borderRadius: 10, flexDirection: "row", alignItems: "center" }}>
					<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 30, height: 30 }} />
					<View style={{ marginLeft: 15 }}>
						<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", color: "#263762" }}>Cantidad de fixcoin: {this.props["navigation"].getParam("cant")}</Text>
						<Text style={{ fontSize: 15, color: "#43AECC", fontFamily: "Raleway-Bold" }}>Precio: $ {this.props["navigation"].getParam("price")}</Text>
					</View>
				</View>

				<Button
					title="COMPRAR"
					buttonStyle={{ backgroundColor: "#42AECB" }}
					titleStyle={{ fontFamily: "Raleway-Bold" }}
					type="solid" containerStyle={{ marginHorizontal: 10, marginBottom: 10 }}
					onPress={() => this.props["navigation"].navigate("PagoEpayco", {
						name: "Compra de " + this.props["navigation"].getParam("cant") + " fixcoin",
						price: this.props["navigation"].getParam("price"),
						id: this.props["navigation"].getParam("id"),
						expert: user["typeId"],
						type: "fixcoin"
					})}
				/>
			</View>
		)
	}
}