import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import { View, Image, AsyncStorage, Text, ScrollView } from 'react-native';
import Copy from "../../componentes/copyVista";
export default class ComprarPlanVista extends Component {
	constructor(props) { super(props); this.state = { user: {}, display: "none", element: { benefits: [] } } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			this.setState({ user: JSON.parse(user), element: this.props["navigation"].getParam("element") });
		})
	}
	render() {
		const { user, element } = this.state;
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

				<Text style={{ marginHorizontal: 30, marginVertical: 15, fontSize: 20, fontFamily: "Raleway-Bold", textAlign: "center", color: "#283B64" }}>Estos son los datos del Plan que vas a adquirir</Text>

				<View style={{ marginBottom: 15, }} >

					<View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 30, backgroundColor: "#F8F8F8" }}>

						<View style={{ flex: 0.5, alignItems: "center" }}>
							<Image source={(element["uri"] === "oro") ?
								require("../../assets/iconos/oro.png") :
								require("../../assets/iconos/bronce.png")} style={{ width: 60, height: 70 }} />
						</View>

						<View style={{ flex: 0.7, }}>
							<View style={{ marginLeft: 10, }}>
								<Text style={{ fontSize: 22, fontFamily: "Raleway-Bold", color: "#263762" }}>Plan {element["denomination"]}</Text>

								<Text style={{ fontSize: 18, color: "#43AECC", fontFamily: "Raleway-Bold", marginTop: 5 }}>$ {element["price"]}</Text>

								<Text style={{ fontFamily: "Raleway-Regular", marginTop: 5 }}>Incluye {element["fixcoin"]} fixcoin</Text>
							</View>
						</View>

					</View>

					<View style={{ backgroundColor: "#F8F8F8", }}>
						<View style={{ paddingHorizontal: 30 }}>
							<Text style={{ textAlign: "left", fontFamily: "Raleway-Bold", fontSize: 18, color: "#263762", marginTop: 10, marginBottom: 5, marginHorizontal: 10 }}>Beneficios</Text>

							{element["benefits"].map((benefit, i) => {
								return <View key={i} style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
									<Image source={require("../../assets/iconos/point2.png")} style={{ width: 10, height: 10, marginTop: 3 }} />
									<Text key={i} style={{ marginHorizontal: 10, marginBottom: 5, fontFamily: "Raleway-Regular", }}>{benefit}</Text>
								</View>
							})}
						</View>

					</View>
				</View>


				<Copy texto="Puedes adquirir más fixcoin cuando se agoten los de tu plan" />


				<Button
					title="COMPRAR"
					buttonStyle={{ backgroundColor: "#42AECB" }}
					titleStyle={{ fontFamily: "Raleway-Bold" }}
					containerStyle={{ marginHorizontal: 10, marginBottom: 10 }}
					onPress={() => this.props["navigation"].navigate("PagoEpayco", {
						name: element["denomination"],
						price: element["price"],
						id: element["id"],
						expert: user["typeId"],
						type: "plan"
					})}
				/>
			</ScrollView>
		)
	}
}