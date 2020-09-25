import React, { Component } from 'react';
import { ScrollView, Text, View, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import Cargador from "../../../componentes/cargador";
import AlertModal from "../../../componentes/alertView";
import { general, info, fixperto } from "../../../style/request";
import { url } from "../../../componentes/config";
export default class CompletadosOfertaVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, cargador: false, services: [] } }
	getOfferts = () => {
		this.setState({ cargador: true });
		AsyncStorage.getItem("@USER")
			.then((user) => {
				user = JSON.parse(user);
				return fetch(url + 'fixperto/getOffertsCompleted', {
					method: "POST",
					headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
					body: JSON.stringify({ id: user["typeId"] })
				}).then(response => response.json()).then(responseJson => {
					this.setState({ cargador: false });
					if (responseJson.success) { this.setState({ services: responseJson.services }); }
					else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
				})
					.catch((error) => {
						this.setState({ cargador: false });
						if (error.message === 'Timeout' || error.message === 'Network request failed') {
							this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
						}
					})
			})
	}
	render() {
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<NavigationEvents onDidFocus={payload => { this.getOfferts() }} />
				<View style={{ backgroundColor: "#EAF9D9", padding: 20 }}>
					<Text style={{ color: "#86CA3D", textAlign: "center", fontFamily: "Raleway-Bold" }}>{(this.state["services"].length) ? "Tus" : "No hay"} trabajos finalizados</Text>
				</View>
				{
					this.state["services"].map((item, i) => (
						<ListItem
							key={i} bottomDivider topDivider
							containerStyle={{ display: (this.state["cargador"]) ? "none" : "flex" }}

							title={

								<View>
									<View style={[general.cont]}>
										<View style={[general.cont_img]}>
											{(item.icon) ?
												<Image source={{ uri: item.icon }} style={[fixperto.img_background_avatar]} />
												: <Image source={require("../../../assets/icon.png")} style={[fixperto.img_background_avatar]} />
											}
										</View>
										<View style={[general.cont_parte2]}>
											{item.emergency === 1 && <View style={[general.cont2, { marginBottom: 3 }]}>
												<Image source={require("../../../assets/iconos/emergencia.png")} style={{ width: 18, height: 18 }} />
												<Text style={[info.text_esperando, { color: "#293763" }]}>Servicio de emergencia</Text>
											</View>}
											<View style={[general.cont4]}>
												<Text style={[info.cont_text_title, { flex: 0.6 }]}>{item.denomination}</Text>

												<Text style={[fixperto.text_location, { flex: 0.4, alignItems: "flex-end" }]}>
													<Ionicons name="ios-pin" size={20} color="#a8a8a8" /> {item.zone}
												</Text>
											</View>

											<View style={[fixperto.text_exp]}>
												<Text style={{ flex: 1, marginTop: 5 }}>{item.customer}</Text>

												<Text style={{ flex: 1, marginTop: 5 }}>Fecha del servicio: {item.start_date}</Text>

												<TouchableOpacity style={[general.cont2, general.cont4]}
													onPress={() => this.props["navigation"].navigate("CompletadoOferta", { item })}>
													<Image source={require("../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
													<Text style={info.ver_mas}>Ver más</Text>
												</TouchableOpacity>

											</View>
										</View>
									</View>
								</View>

							}
							onPress={() => this.props["navigation"].navigate("CompletadoOferta", { item })}
						/>
					))
				}
				<Cargador show={this.state["cargador"]} texto="Actualizando servicios completados..." />
			</ScrollView>
		);
	}
}
