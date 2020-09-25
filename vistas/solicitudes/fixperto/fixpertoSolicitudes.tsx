import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, TouchableOpacity, ImageBackground, Dimensions, Image, Text, Platform } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Ionicons } from '@expo/vector-icons';
import { NavigationEvents } from 'react-navigation';
import { ListItem, Button, CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import Cargador from "../../../componentes/cargador";
import AlertModal from "../../../componentes/alertView";
import { general, info, fixperto } from "../../../style/request";
import { alerts } from "../../../style/alerts";
import Actualizar from "../../../componentes/actualizarVista";
import { socket } from "../../../componentes/socket";
import { Notifications } from 'expo';
import { url } from "../../../componentes/config";
class AlertFixcoin extends Component {
	constructor(props) { super(props); }
	comprarFixcoin = () => {
		this.props["closeModal"]();
		this.props["navigation"].navigate("Fixcoins");
	}
	render() {
		return (
			<Modal
				isVisible={this.props["showAlertFix"] || false}
				animationIn="zoomIn"
				animationOut="zoomOut"
			>
				<View style={[{
					justifyContent: "center",
					backgroundColor: "#ffffff",
					padding: 20,
					flexDirection: "column",
					borderRadius: 10
				}]}>
					<View style={[alerts.cont]}>
						<View style={[alerts.borderAlert]}>
							<View style={[alerts.contAlert]}>
								<Image source={require('../../../assets/iconos/alert_icon.png')} style={[alerts.contAlertImg]} />
							</View>
						</View>
						<Text style={[alerts.title]}>Información</Text>
					</View>
					<View style={[alerts.cont]}>

						<Text style={[alerts.desc]}>No tienes los fixcoin necesarios para ofrecer este servicio, compra paquetes de fixcoin aquí</Text>
						<Text style={[alerts.title, { textDecorationLine: "underline", marginTop: 10 }]} onPress={() => { this.comprarFixcoin() }}>Comprar fixcoin</Text>
						<Text style={[alerts.btnOk]}
							onPress={this.props["closeModal"]}>Aceptar</Text>
					</View>
				</View>
			</Modal>
		)
	}
}
export default class FixpertoSolicitudesVista extends Component {
	constructor(props) {
		super(props);
		this.state = { showAlertFix: false, activo: false, textoAlert: "", showAlert: false, cargadorModal: true, cargadorText: "Actualizando...", cargador: false, copy: [], isModalVisible: false, cant_fitcoints: "", requests: [], regions: [], categories: [], orden: { reciente: false, cupos: false }, filtro: { region: 0, category: 0 } }
	}
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			socket.on('connect', () => { socket.emit('cliente', { id: user["id"] }); });
		})
	}
	getRegionsCategories = (user) => {
		return fetch(url + 'seguridad/getRegionsCategories', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ expert: user["typeId"] })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ cant_fitcoints: user["cant_fitcoints"], regions: responseJson.regions, categories: responseJson.categories }) }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un error, por favor pruebe nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	getRequests = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			this.setState({ cant_fitcoints: user["cant_fitcoints"], cargadorModal: false, cargador: true, cargadorText: "Actualizando solicitudes..." });
			return fetch(url + 'fixperto/getRequests', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					this.setState({ activo: (responseJson.active === 0) ? false : true, cargador: false, requests: responseJson.requests, copy: responseJson.requests });
					this.getRegionsCategories(user);
				}
				else { this.setState({ cargador: false, showAlert: true, textoAlert: "Ha ocurrido un error, por favor pruebe nuevamente" }); }
			}).catch((error) => {
				this.setState({ cargador: false });
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	cancelRequest = (id) => {
		this.setState({ cargadorModal: true, cargador: true, cargadorText: "Cancelando solicitud..." });
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixperto/cancelRequest', {
				method: "POST", headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ expert: user["typeId"], request: id })
			}).then(response => response.json()).then(responseJson => {
				this.setState({ cargador: false });
				if (responseJson.success) this.getRequests();
			}).catch((error) => {
				this.setState({ cargador: false });
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	ofertar = (id, cost, action, registry_date, solicitud) => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			if (this.state["cant_fitcoints"] >= cost)
				this.props["navigation"].navigate("RealizarOferta", {
					request: id, cost, expert: user["typeId"], action, registry_date, solicitud
				})
			else { this.setState({ showAlertFix: true }); }
		})
	}
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	ordenar = type => {
		var orden = Object.assign({}, this.state["orden"]);
		if (type === "reciente") {
			orden["reciente"] = !orden["reciente"];
			orden["cupos"] = false;
			this.state["copy"].sort(function (a, b) {
				var fromA = a.registry_date.split("/"); a = new Date(fromA[2], fromA[1] - 1, fromA[0]);
				var fromB = b.registry_date.split("/"); b = new Date(fromB[2], fromB[1] - 1, fromB[0]);
				return a > b ? -1 : a < b ? 1 : 0;
			});
		}
		else {
			orden["cupos"] = !orden["cupos"];
			orden["reciente"] = false;
			this.state["copy"].sort(function (a, b) {
				if (a.experts < b.experts) { return 1; }
				if (a.experts > b.experts) { return -1; }
				return 0;
			});
		}
		this.setState({ orden });
	}
	filtrar = (type, filt) => {
		let copy = [];
		if (filt !== 0) {
			copy = this.state["requests"].filter(request => {
				if (type === "category") {
					if (this.state["filtro"]["region"] !== 0) {
						return request["service_id"] === filt && request["region"] === this.state["filtro"]["region"];
					} else { return request["service_id"] === filt; }
				}
				else {
					if (this.state["filtro"]["category"] !== 0) {
						return request["region"] === filt && request["service_id"] === this.state["filtro"]["category"];
					} else { return request["region"] === filt; }
				}
			});
		}
		else {
			copy = this.state["requests"].filter(request => {
				if (type === "category") {
					if (this.state["filtro"]["region"] !== 0) {
						return request["region"] === this.state["filtro"]["region"];
					} else { return true; }
				}
				else {
					if (this.state["filtro"]["category"] !== 0) {
						return request["service_id"] === this.state["filtro"]["category"];
					} else { return true; }
				}
			});
		}
		var filtro = Object.assign({}, this.state["filtro"]);
		filtro[type] = filt;
		this.setState({ copy, filtro });
	}
	render() {
		const { width } = Dimensions.get('window');
		const { copy, activo } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
					<AlertFixcoin navigation={this.props["navigation"]} showAlertFix={this.state["showAlertFix"]} closeModal={() => { this.setState({ showAlertFix: false }) }} />
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onWillFocus={payload => { this.getRequests() }} />
					<View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderTopWidth: 0.5, borderColor: "silver" }}>
						<Text style={{ flex: 0.8, marginHorizontal: 10 }}>{copy.length} trabajo(s) disponible(s)</Text>
						<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
							onPress={() => { this.toggleModal() }}>
							<Text>Filtro</Text>
							<Ionicons name="ios-arrow-down" size={20} style={{ marginStart: 5 }} />
						</TouchableOpacity>
					</View>
					<View style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.58, shadowRadius: 16.00, elevation: 15, borderColor: "#FFFFFF", borderWidth: 0.5 }}>
						<ImageBackground source={require('../../../assets/iconos/baner_experto.png')}
							style={[fixperto.img_background, { width: width + 38 }]}>
							<Text style={[fixperto.img_background_text1]}>Aplica a un servicio</Text>
							<Text style={fixperto.img_background_text2}>{this.state["cant_fitcoints"]} Fixcoin  {"\n"}disponibles</Text>
						</ImageBackground>
					</View>
					<Cargador show={this.state["cargador"]} texto={this.state["cargadorText"]} modal={this.state["cargadorModal"]} />
					{(activo) ? copy.map((item, i) => (
						<ListItem
							key={i} bottomDivider topDivider
							containerStyle={[general.container, { padding: 15, display: (this.state["cargador"]) ? "none" : "flex" }]}
							title={
								<View style={[general.cont]}>
									<View style={[{ flex: 0.2, height: 80, }]}>
										{(item.icon) ?
											<Image source={{ uri: item.icon }} style={[fixperto.img_background_avatar]} />
											: <Image source={require("../../../assets/icon.png")} style={[fixperto.img_background_avatar]} />
										}
									</View>
									<View style={[{ backgroundColor: "#FFFFFF", flex: 0.8, padding: 10, }]}>
										{item.emergency === 1 && <View style={[general.cont2]}>
											<Image source={require("../../../assets/iconos/emergencia.png")} style={{ width: 18, height: 18 }} />
											<Text style={[info.text_esperando, { color: "#293763" }]}>Solicitud de emergencia</Text>
										</View>}
										<View style={[general.cont4]}>
											<Text style={[info.cont_text_title, { flex: 0.6 }]}>{item.denomination}</Text>
											<Text style={[fixperto.text_location, { flex: 0.4, alignItems: "flex-end" }]}>
												<Ionicons name="ios-pin" color="#A8A8A8" size={20} /> {item.zone}
											</Text>
										</View>
										<View style={[general.cont4, { flex: 1, flexDirection: "row", justifyContent: "space-between" }]}>
											<Button
												buttonStyle={[fixperto.button_aceptar]}
												icon={<Ionicons name="ios-checkmark" size={30} color="#43AECC" />}
												title="Ver Detalle"
												titleStyle={[fixperto.text_button]}
												onPress={() => this.ofertar(item.id, item.cost, "add", item.registry_date, item.solicitud)} />
											<View style={[fixperto.cont_delete, { flex: 0.5, alignItems: "center" }]}>
												<Ionicons name="ios-trash" size={30} color="#CE4343" style={[fixperto.cont_delete_icon]} onPress={() => this.cancelRequest(item.id)} />
											</View>
										</View>
										<View style={[fixperto.text_exp]}>
											<Text style={{ flex: 1 }}>Expertos: {item.experts}/5</Text>
											<View style={[general.cont4, { marginTop: -20 }]}>
												<Text style={[fixperto.text_valor, { flex: 1, alignItems: "flex-end" }]}> Valor: </Text>
												<Image source={require("../../../assets/iconos/fixcoin.png")} style={{ width: 15, height: 15, marginLeft: 5 }} />
												<Text style={[fixperto.text_valor, { marginLeft: 5 }]}>{item.cost}</Text>
											</View>
										</View>
									</View>
								</View>
							}
						/>
					)) :
						<View style={{ backgroundColor: "#EAF9D9", padding: 20 }}>
							<Text style={{ color: "#86CA3D", textAlign: "center", fontFamily: "Raleway-Bold", fontSize: 15, paddingHorizontal: 50 }}>Estás a punto de ser un fixperto, hemos recibido tu información y estamos en proceso de validación. Tu activación en plataforma quedará en aproximadamente 24 horas. </Text>
						</View>
					}
					<Modal isVisible={this.state["isModalVisible"]}>
						<View style={{ flex: 1, marginHorizontal: 30, marginVertical: 60 }}>
							<ScrollView style={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}>
								<Text style={{ color: "#26315F", fontFamily: "Raleway-Bold", fontSize: 15, textAlign: "justify", padding: 10 }}>Ordenar por:</Text>
								<CheckBox
									title='Del más reciente al más antiguo'
									checkedIcon='dot-circle-o'
									uncheckedIcon='circle-o'
									checked={this.state["orden"]["reciente"]}
									onPress={() => { this.ordenar("reciente") }}
								/>
								<CheckBox
									title='Cupos disponibles'
									checkedIcon='dot-circle-o'
									uncheckedIcon='circle-o'
									checked={this.state["orden"]["cupos"]}
									onPress={() => { this.ordenar("cupos") }}
								/>
								<Text style={{ color: "#26315F", fontFamily: "Raleway-Bold", fontSize: 15, textAlign: "justify", padding: 10 }}>Filtrar por:</Text>
								<Text style={{ textAlign: "justify", marginTop: 10, marginHorizontal: 10 }}>Región</Text>
								<MultiSelect
									hideTags hideDropdown hideSubmitButton single
									selectText="Seleccione"
									items={this.state["regions"]}
									uniqueKey="id"
									displayKey="name"
									onSelectedItemsChange={(selectedItems) => { this.filtrar("region", selectedItems[0]) }}
									selectedItems={[this.state["filtro"]["region"]]}
									tagTextColor="#CCC"
									selectedItemTextColor="#CCC"
									itemTextColor="#000"
									styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
									searchInputPlaceholderText="Buscar..."
								/>
								<Text style={{ textAlign: "justify", marginTop: 10, marginHorizontal: 10 }}>Categoría</Text>
								<MultiSelect
									hideTags hideDropdown hideSubmitButton single
									selectText="Seleccione"
									items={this.state["categories"]}
									uniqueKey="id"
									displayKey="denomination"
									onSelectedItemsChange={(selectedItems) => { this.filtrar("category", selectedItems[0]) }}
									selectedItems={[this.state["filtro"]["category"]]}
									tagTextColor="#CCC"
									selectedItemTextColor="#CCC"
									itemTextColor="#000"
									styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
									searchInputPlaceholderText="Buscar..."
								/>
								<Button title="CERRAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
									titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
									onPress={() => this.toggleModal()}
								/>
							</ScrollView>
						</View>
					</Modal>
				</ScrollView >
				<Actualizar reload={this.getRequests} />
			</View >
		)
	}
}