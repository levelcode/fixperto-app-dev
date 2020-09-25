import React, { Component } from "react";
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Modal from "react-native-modal";
import { Ionicons } from '@expo/vector-icons';
import Regiones from "./regionesVista";
export default class CiudadVista extends Component {
	constructor(props) {
		super(props);
	}


	state = {
		isModalVisible: false,
		descriptions: [
			{
				name: "Bogotá", zonas: [
					{ name: "Norte" },
					{ name: "Noroccidente" },
					{ name: "Occidente" },
					{ name: "Sur" },
					{ name: "Cota" },
					{ name: "Chia" },
					{ name: "La Calera" },
					{ name: "Chapinero" },
					{ name: "Centro" },
					{ name: "Mosquera" },
					{ name: "Funza" },
					{ name: "Soacha" },
					{ name: "Chipaque" },
				]
			},
			{
				name: "Medellín", zonas: []
			}, {
				name: "Cali", zonas: []
			}, {
				name: "Barranquilla", zonas: []
			}
		]
	};
	toggleModal = () => { this.setState({ isModalVisible: !this.state.isModalVisible }); }
	selectedRegions = (action, region) => { this.props["regionsSelected"](action, region); }

	render() {
		let coordinate = this.props["coordinate"];
		let regions = this.props["regions"];
		let altura = this.props["height"];
		let single = this.props["single"];
		let seleccionadas = this.props["seleccionadas"] || [];
		return (
			<ScrollView style={{ flex: 1 }}>
				<View>
					<View style={{ alignItems: "center" }}>
						<Regiones coordinate={coordinate} regions={regions} selectedRegions={this.selectedRegions} seleccionadas={seleccionadas} altura={altura} single={single} />
					</View>
				</View>
				<Modal isVisible={this.state.isModalVisible}>
					<View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35 }}>
						<View style={{ flex: 1, backgroundColor: "#FFFFFF", borderRadius: 10, padding: 20 }}>
							<View style={{ flexDirection: "row" }}>
								<View style={{ flex: 0.9, marginStart: 10, marginTop: 10 }}>
									<Text style={{ fontFamily: "Raleway-Bold", color: "#232A3D", marginVertical: 5 }}>Comprende las siguientes zonas:</Text>
								</View>
								<View style={{ flexDirection: "row-reverse" }}>
									<Ionicons name="ios-close" size={40} color="#42AECB" onPress={this.toggleModal} />
								</View>
							</View>
							<ScrollView>
								{this.state.descriptions.map((item, index) => {
									return (<View key={index} style={{ marginHorizontal: 10, marginBottom: 10 }}>
										<Text style={{ fontFamily: "Raleway-Bold", color: "#232A3D" }}>{item["name"]}</Text>
										{item["zonas"].map((zona, ind) => {
											return (<Text key={ind} style={{ marginHorizontal: 5 }}>{zona["name"]}</Text>)
										})}
									</View>)
								})}
							</ScrollView>
						</View>
					</View>
				</Modal>


				<Text style={{ textAlign: "center", marginVertical: 5, marginHorizontal: 10 }}>
					Toca las zonas donde quieres prestar tus servicios
				</Text>


				<TouchableOpacity onPress={this.toggleModal}>
					<Text style={{ textAlign: "center", marginVertical: 5, textDecorationLine: 'underline', color: "#42AECB" }}>
						Descripción de zonas de cobertura</Text>
				</TouchableOpacity>
			</ScrollView>
		)
	}
}