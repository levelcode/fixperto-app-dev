import React, { Component } from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class PlanesVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, plans: [], flexComponentOro: false, flexComponentBronce: false } }
	componentDidMount() { if (!(this.state["plans"].length > 0)) { this.getPlanes(); } }
	getPlanes = () => {
		return fetch(url + 'fixperto/getPlans', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ plans: responseJson.planes }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	render() {
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				{this.state["plans"].map((element, i) => (

					<ScrollView key={i}>

						<Divider></Divider>

						<View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 30, backgroundColor: "#ededed" }}>

							<View style={{ flex: 0.5, alignItems: "center" }}>
								<Image source={(element["uri"] === "oro") ?
									require("../../assets/iconos/oro.png") :
									require("../../assets/iconos/bronce.png")} style={{ width: 60, height: 70 }} />
							</View>

							<View style={{ flex: 0.7, }}>
								<View style={{ marginLeft: 10, }}>
									<Text style={{ fontSize: 22, fontFamily: "Raleway-Bold", color: "#263762" }}>Plan {element["denomination"]}</Text>

									<Text style={{ fontSize: 18, color: "#43AECC", fontFamily: "Raleway-Bold", marginTop: 5 }}>$ {element["price"]}</Text>

									<Text style={{ fontFamily: "Raleway-Regular", marginTop: 5 }}>Incluye {element["fitcoints"]} fixcoin</Text>
								</View>
							</View>

						</View>

						<View style={{ backgroundColor: "#ededed" }}>

							<TouchableOpacity onPress={() => {

								element["uri"] === "oro" ? this.setState({ flexComponentOro: !this.state['flexComponentOro'] })
									: this.setState({ flexComponentBronce: !this.state['flexComponentBronce'] })
							}}>
								<View style={{ flex: 1, flexDirection: "row" }}>
									<View style={{ flex: 0.8 }}>
										<Text style={{ textAlign: "left", fontFamily: "Raleway-Bold", fontSize: 16, color: "#263762", marginTop: 10, marginBottom: 10, marginHorizontal: 50, }}>Ver Beneficios</Text>
									</View>

									<View style={{ flex: 0.2 }}>
										<Ionicons name="ios-arrow-down" size={25} color="#46ADCC" style={{ marginHorizontal: 5, marginTop: 5 }} />
									</View>
								</View>


							</TouchableOpacity>
						</View>

						<View style={{
							backgroundColor: "#ededed", paddingBottom: 50, height: (element["uri"] == "oro" && this.state['flexComponentOro']) ? 47 + "%" : (element["uri"] == "oro" && !this.state['flexComponentOro']) ? 0
								: (element["uri"] == "bronce" && this.state['flexComponentBronce']) ? 38 + "%" : 0
						}}>

							<Divider></Divider>

							<View style={{ paddingHorizontal: 30, marginTop: 10, marginBottom: 30 }}>
								{element["benefits"].map((benefit, i) => {
									return <View key={i} style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 5, marginTop: 10 }}>
										<Ionicons name="ios-radio-button-on" size={15} color="#273861" style={{ marginHorizontal: 5 }} />
										<Text style={{ marginHorizontal: 5, marginBottom: 5, fontFamily: "Raleway-Regular", }}>{benefit}</Text>
									</View>
								})}
							</View>

						</View>

						<Button
							title="LO QUIERO"
							buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 5, paddingVertical: 10 }}
							titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 14 }} containerStyle={{ marginHorizontal: 25, marginVertical: 20, marginTop: -20 }}
							onPress={() => { this.props["navigation"].navigate("ComprarPlan", { element: element }) }}
						/>
					</ScrollView>
				))}
			</ScrollView>
		)
	}
}

