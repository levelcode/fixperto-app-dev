import React, { Component } from 'react';
import { ScrollView, Text, AsyncStorage, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ListItem } from 'react-native-elements';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class CategoriasServicioVista extends Component {
	constructor(props) {
		super(props);
		this.state = { textoAlert: "", showAlert: false, user: {}, categories: [] }
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ user }); })
	}
	componentDidMount() { this.getCategoriesByService(); }
	getCategoriesByService = () => {
		var urll = (this.props["navigation"].getParam("service").emergency) ? url + 'services/getCategoriesEmergency' : url + 'services/getCategoriesByService';
		return fetch(urll, {
			method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ service: this.props["navigation"].getParam("service").id })
		}).then(response => response.json()).then(responseJson => { this.setState({ categories: responseJson.categories }); })
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	categorySelected(item) {
		this.props["navigation"].navigate('NuevaSolicitud', {
			category: item, service: this.props["navigation"].getParam('service'), user: this.state["user"]
		});
	}
	render() {
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<Text style={{ fontSize: 15, fontFamily: "Raleway-Bold", marginHorizontal: 15, marginVertical: 15, textAlign: "center" }}>{this.state["user"].name}<Text style={{ fontWeight: "100" }}>, tu experto en {this.props["navigation"].getParam("service").grouped} es para... </Text></Text>
				{
					this.state["categories"].map((item, i) => (
						<ListItem
							key={i}
							title={item.denomination}
							titleStyle={{ fontFamily: "Raleway-Regular" }}
							bottomDivider
							leftAvatar={<Image source={{ uri: this.props["navigation"].getParam("service").icon }} style={{ width: 25, height: 25 }} />}
							chevron={<Ionicons name="ios-arrow-forward" size={20} color="#46ADCC" style={{ marginHorizontal: 5 }} />}
							onPress={() => this.categorySelected(item)} />
					))
				}
			</ScrollView>
		);
	}
}
