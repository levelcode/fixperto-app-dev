import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import { ListItem } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import Copy from "../../../../componentes/copyVista";
import Cargador from "../../../../componentes/cargador";
import AlertModal from "../../../../componentes/alertView";
import { general, info } from "../../../../style/request.js";
import { url } from "../../../../componentes/config";
export default class ProgresosSolicitudVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, cargador: false, requests: [] } }
	getRequests = () => {
		this.setState({ cargador: true });
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'cliente/getRequestsProgress', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				this.setState({ cargador: false });
				if (responseJson.success) { this.setState({ requests: responseJson.requests }); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un error, por favor pruebe nuevamente" }); }
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
			<View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
				<Cargador show={this.state["cargador"]} texto="Actualizando solicitudes..." />
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<ScrollView>
					<NavigationEvents onDidFocus={payload => { this.getRequests() }} />
					{this.state["requests"].length > 0 && <View style={{ backgroundColor: "#EAF9D9", flexDirection: "row", padding: 5, alignItems: "center" }}>
						<Image source={require("../../../../assets/iconos/progreso.png")} style={{ marginLeft: 15, marginRight: 5, width: 35, height: 32 }} />
						<View style={{ backgroundColor: "#EAF9D9", marginHorizontal: 5, flex: 0.9, padding: 10 }}>
							<Text style={{ color: "#86CA3D", fontFamily: "Raleway-Bold" }}>Pronto recibirás una notificación</Text>
							<Text style={{ color: "#86CA3D" }}>Nuestros expertos están evaluando tu servicio</Text>
						</View>
					</View>}
					{this.state["requests"].length > 0 &&
						this.state["requests"].map((item, i) => (
							<ListItem
								containerStyle={[general.contaner, { display: (this.state["cargador"]) ? "none" : "flex" }]}
								key={i} bottomDivider topDivider
								title={
									<View style={[general.cont, { borderLeftWidth: 0.5, borderLeftColor: (item["oferts"] === 4) ? "#F96511" : (item["oferts"] === 3) ? "#43AECC" : "#FFFFFF" }]}>
										<View style={{ flex: 0.3, alignItems: "center" }}>
											<View style={[info.cont_img]}>
												{(item.icon) ?
													<Image source={{ uri: item.icon }} style={{ width: 50, height: 50, }} />
													: <Image source={require("../../../../assets/icon.png")} style={{ width: 50, height: 50, }} />
												}
											</View>
										</View>

										<View style={{ flex: 0.9, }}>
											<View style={[info.cont_text]}>
												{item.emergency === 1 && <View style={[general.cont2, { marginBottom: 5 }]}>
													<Image source={require("../../../../assets/iconos/emergencia.png")} style={{ width: 18, height: 18 }} />
													<Text style={[info.text_esperando, { color: "#293763" }]}>Solicitud de emergencia</Text>
												</View>}
												<Text style={[info.cont_text_title]}>{item.service}
													<Text style={[info.cont_text_title_cat]}>/{item.category}</Text>
												</Text>
												<Text style={[info.cont_text_date]}>{item.registry_date}</Text>
												{
													item["oferts"] === 0 &&
													<View style={[general.cont4]}>
														<Image source={require("../../../../assets/iconos/esperando.png")} style={info.img_esperando} />
														<Text style={[info.text_esperando]}>Esperando servicios</Text>
													</View>
												}
												<TouchableOpacity style={[general.cont4]} onPress={() => this.props["navigation"].navigate("ProgresoDetalle", { id: item.id })}>
													<Image source={require("../../../../assets/iconos/mas.png")} style={[info.img_ver_mas]} />
													<Text style={info.ver_mas}>Ver más</Text>
												</TouchableOpacity>
											</View>
										</View>


									</View>
								}
								onPress={() => this.props["navigation"].navigate("ProgresoDetalle", { id: item.id })}
							/>
						))
					}

				</ScrollView>
				<Copy texto="Nuestros fixpertos han pasado por una verificación de datos" />
			</View>
		);
	}
}
