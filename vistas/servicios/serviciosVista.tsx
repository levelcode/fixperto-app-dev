import React, { Component } from 'react';
import { FlatList, View, AsyncStorage, TouchableHighlight, Dimensions, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { SearchBar, Input, Button, ListItem, Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import { buttons } from "../../style/style";
import AlertModal from "../../componentes/alertView";
var { width } = Dimensions.get("window");
width = (width / 3) - 5;
import { socket } from "../../componentes/socket";
import { Notifications } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';
import { url } from "../../componentes/config";
class Categorias extends Component {
	constructor(props) { super(props); this.state = { isShown: true }; }
	render() {
		return (
			<View>
				<Divider />
				<TouchableOpacity
					onPress={() => { this.setState({ isShown: !this.state["isShown"] }); }}
					style={{ flexDirection: "row-reverse", padding: 10, height: 50, alignItems: 'center' }}>
					<Ionicons name={(!this.state["isShown"]) ? "ios-arrow-forward" : "ios-arrow-down"} size={20} style={{ marginHorizontal: 10 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1, marginHorizontal: 10 }}>{this.props["item"]["grouped"]}</Text>
				</TouchableOpacity>
				{this.state["isShown"] ? this.props["item"]["elementos"].map((elem, k) => {
					return <ListItem key={k}
						containerStyle={{ backgroundColor: "#F8F8F8" }}
						title={elem["label"]}
						titleStyle={{ fontFamily: "Raleway-Regular" }}
						bottomDivider
						onPress={() => { this.props["categorySelect"](elem, this.props["item"]); }} />
				}) : null}
				<Divider />
			</View >
		)
	}
}
export default class ServiciosVista extends Component {
	constructor(props) { super(props); this.state = { showCategorias: false, textoAlert: "", showAlert: false, user: {}, services: [], copy: [], search: "", new_categori: "" } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user); this.setState({ user });
			socket.on('connect', () => { socket.emit('cliente', { id: user["id"] }); });
		})
	}
	getServices = () => {
		return fetch(url + 'services/getServicess', { method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth } })
			.then(response => response.json()).then(responseJson => {
				let categories = responseJson.categories;
				categories.unshift(responseJson.categoriesEmergency);
				this.setState({ services: categories, copy: categories })
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	updateSearch = search => {
		let copy = []
		this.state["services"].map((service, ind) => {
			let cop = [];
			cop = service["elementos"].filter(elemento => (elemento["label"].toLowerCase()).indexOf(search.toLowerCase()) !== -1);
			if (cop.length > 0) { service["elementos"] = cop; copy.push(service); };
		});
		this.setState({ search, copy });
	};
	servicioSelected(item) { this.props["navigation"].navigate('CategoriasServicio', { service: item }); }
	keyExtractor = (item, index) => index.toString()
	addCategory = () => {
		return fetch(url + 'services/addCategoriaSugerida',
			{
				method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ denomination: this.state["new_categori"], user: this.state["user"]["id"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.setState({ showAlert: true, textoAlert: "Gracias por tu mensaje", new_categori: "", search: "", copy: this.state["services"] });
				}
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un error, inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	categorySelect = (category, service) => {
		this.setState({ search: "" });
		this.props["navigation"].navigate('NuevaSolicitud', { category, service, user: this.state["user"] });
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ flex: 1 }}>
					<NavigationEvents onWillFocus={payload => { this.getServices() }} />
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<View style={{ backgroundColor: '#43AECC', marginBottom: 40, }}>
						<Text style={{ marginStart: 20, marginTop: 20, color: "#273861", fontSize: 22, }}>Servicios</Text>
						<Text style={{ marginHorizontal: 20, marginTop: 10, fontSize: 16, color: "#273861", marginBottom: 10, position: "relative" }}><Text style={{ fontFamily: "Raleway-Bold" }}>{this.state["user"].name}</Text> ¿necesitas un experto en... ?</Text>
						<SearchBar
							placeholder="Buscar..."
							onChangeText={this.updateSearch}
							value={this.state["search"]}
							containerStyle={{ backgroundColor: "#43AECC", borderTopColor: "#43AECC", borderBottomColor: "#43AECC", marginHorizontal: 15, }}
							inputContainerStyle={{ backgroundColor: "#FFFFFF", borderRadius: 7, padding: 5 }}
						/>
					</View>
					{(this.state["search"] !== "")
						? (this.state["copy"].length === 0)
							? <View style={{ flex: 1, paddingHorizontal: 20 }}>
								<Text style={{ textAlign: "center", fontSize: 15, fontFamily: "Raleway-Bold", marginVertical: 10, color: "#43AECC" }}>Tu búsqueda no arrojó resultados, escribe aquí la categoría que estas buscando</Text>
								<Input
									inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, borderRadius: 5, paddingLeft: 10, height: 50, fontFamily: "Raleway-Regular" }}
									inputContainerStyle={{ borderWidth: 1, borderRadius: 5, borderColor: "silver", }}
									value={this.state["new_categori"]} onChangeText={(new_categori) => this.setState({ new_categori })}
								/>
								<Button title="ENVIAR" buttonStyle={buttons.primary}
									disabled={this.state["new_categori"] === ""}
									titleStyle={buttons.PrimaryText}
									onPress={() => this.addCategory()}
								/>
							</View>
							: <ScrollView style={{ flex: 1 }}>
								{this.state["copy"].map((item, i) => {
									return <Categorias key={i} item={item} categorySelect={(category, service) => { this.categorySelect(category, service) }} user={this.state["user"]} />
								})}
							</ScrollView>
						: <View style={{ flex: 1, alignItems: "center", marginTop: -35 }}>
							<FlatList
								numColumns={3}
								keyExtractor={this.keyExtractor}
								data={this.state["copy"]}
								renderItem={({ item }) => {
									return <TouchableHighlight underlayColor="#F0F0F0" activeOpacity={0} onPress={() => this.servicioSelected(item)}>
										<View style={{
											width: 90, height: 90, alignItems: "center", borderRadius: 15, paddingLeft: 5, paddingRight: 5, paddingTop: 18, backgroundColor: "#FFFFFF", margin: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 3, }, shadowOpacity: 0.29, shadowRadius: 4.65, elevation: 7
										}}>
											<Image source={{ uri: item.icon }} style={{ width: 35, height: 35 }} />
											<Text style={{ fontSize: 12, fontWeight: "500", textAlign: "center", color: "#293763" }}>{item.grouped}</Text>
										</View>
									</TouchableHighlight>
								}}
							/>
						</View>
					}
				</View >
			</View >
		)
	}
}