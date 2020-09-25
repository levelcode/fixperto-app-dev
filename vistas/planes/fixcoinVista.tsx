import React, { Component } from "react";
import { View, AsyncStorage, ScrollView, Image, Text } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button, Divider } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class FixcoinsVista extends Component {
	referencia = null;
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, expert: {}, tariffs: [], isModalVisible: false } }
	componentDidMount() { AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ expert: user }); }) }
	comprar = (price, cant, id) => { this.props["navigation"].navigate("ComprarFixcoin", { price, cant, id }); }
	amigos = () => { this.props["navigation"].navigate("ReferirAmigo"); }
	verTarifas = () => {
		this.toggleModal();
		if (!(this.state["tariffs"].length > 0)) {
			return fetch(url + 'services/getServicesCategoriesTariffs', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
			}).then(response => response.json()).then(responseJson => {
				this.setState({ tariffs: responseJson.tariffs });
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
	}
	verTransacciones = () => { this.props["navigation"].navigate("VerTransacciones"); }
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	render() {
		const { expert, tariffs } = this.state;
		return (
			<ScrollView ref={referen => this.referencia = referen} >
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ marginHorizontal: 10, marginVertical: 10, borderWidth: 0.5, borderRadius: 7, borderColor: "#42AECC", paddingTop: 20 }}>
					<View style={{ flexDirection: "row" }}>
						<View style={{ flex: 0.4, borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 57, height: 57, marginTop: -10, }} />
						</View>
						<View style={{ justifyContent: "center", padding: 10, flex: 0.7 }}>
							<Text style={{ fontSize: 20, marginVertical: 5, fontFamily: "Raleway-Bold", color: "#263762", }}>Tienes</Text>
							<Text style={{ color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20 }}>{expert["cant_fitcoints"]} fixcoin</Text>
						</View>
					</View>
					<TouchableOpacity style={{ backgroundColor: "#ECF7FA", padding: 10, borderRadius: 7 }} onPress={() => { this.referencia.scrollToEnd() }}>
						<Text style={{ textAlign: "center", color: "#46ADCC", fontFamily: "Raleway-Bold", fontSize: 16 }}>Conoce como usarlos</Text>
					</TouchableOpacity>
				</View>
				<Divider />
				<TouchableOpacity onPress={() => { this.verTransacciones() }}
					style={{ flexDirection: "row-reverse", padding: 15 }}>
					<Ionicons name="ios-arrow-forward" size={25} color="#46ADCC" style={{ marginHorizontal: 5 }} />
					<Text style={{ fontSize: 15, textAlign: "left", flex: 1 }}> Historial de fixcoin</Text>
				</TouchableOpacity>
				<Divider />
				<Divider />

				<Text style={{ fontFamily: "Raleway-Bold", color: "#283B64", marginStart: 5, textAlign: "center", marginVertical: 15, paddingHorizontal: 20 }}>Los fixcoin son acumulables y nunca se vencen, compra tu paquete ahora</Text>

				<View style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10 }}>

					<View style={{ flex: 0.5, borderColor: "#ADB3C3", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopLeftRadius: 7, borderBottomLeftRadius: 7, }}>
						<View style={{ flexDirection: "row" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25 }} />
							<Text style={{ marginLeft: 10, color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20 }}>5 fixcoin</Text>
						</View>
						<Text style={{ textAlign: "center", marginTop: 10 }}>Cada fixcoin a $3000</Text>
					</View>

					<View style={{ flex: 0.5, borderColor: "#43AECC", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopRightRadius: 7, borderBottomRightRadius: 7, }} >
						<Text style={{ color: "#43AECC", fontFamily: "Raleway-Bold", fontSize: 23, marginTop: -5 }}>$15000</Text>

						<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#47AAC9", paddingVertical: 3, paddingHorizontal: 15, }}
							title="COMPRAR" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12 }}
							containerStyle={{ marginTop: 10, alignItems: "flex-start" }}
							onPress={() => this.comprar(15000, 5, 1)} />
					</View>

				</View>

				<View style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10 }}>

					<View style={{ flex: 0.5, borderColor: "#ADB3C3", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopLeftRadius: 7, borderBottomLeftRadius: 7, }}>
						<View style={{ flexDirection: "row" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25, }} />
							<Text style={{ marginLeft: 10, color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20 }}>10 fixcoin</Text>
						</View>
						<Text style={{ textAlign: "center", marginTop: 10 }}>Cada fixcoin a $2800</Text>
					</View>

					<View style={{ flex: 0.5, borderColor: "#43AECC", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopRightRadius: 7, borderBottomRightRadius: 7, }}>
						<Text style={{ color: "#43AECC", fontFamily: "Raleway-Bold", fontSize: 23, marginTop: -5 }}>$28000</Text>
						<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#47AAC9", paddingVertical: 3, paddingHorizontal: 15 }}
							title="COMPRAR" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12 }}
							containerStyle={{ marginTop: 10, alignItems: "flex-start" }}
							onPress={() => this.comprar(28000, 10, 2)} />
					</View>
				</View>

				<View style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10 }}>

					<View style={{ flex: 0.5, borderColor: "#ADB3C3", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopLeftRadius: 7, borderBottomLeftRadius: 7, }}>
						<View style={{ flexDirection: "row" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25, }} />
							<Text style={{ marginLeft: 10, color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20 }}>30 fixcoin</Text>
						</View>
						<Text style={{ textAlign: "center", marginTop: 10 }}>Cada fixcoin a $2600</Text>
					</View>

					<View style={{ flex: 0.5, borderColor: "#43AECC", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopRightRadius: 7, borderBottomRightRadius: 7, }}>
						<Text style={{ color: "#43AECC", fontFamily: "Raleway-Bold", fontSize: 23, marginTop: -5 }}>$78000</Text>
						<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#47AAC9", paddingVertical: 3, paddingHorizontal: 15 }}
							title="COMPRAR" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12 }}
							containerStyle={{ marginTop: 10, alignItems: "flex-start" }}
							onPress={() => this.comprar(78000, 30, 3)} />
					</View>
				</View>

				<View style={{ flexDirection: "row", marginHorizontal: 10, marginBottom: 10 }}>

					<View style={{ flex: 0.5, borderColor: "#ADB3C3", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopLeftRadius: 7, borderBottomLeftRadius: 7, }}>
						<View style={{ flexDirection: "row" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25, }} />
							<Text style={{ marginLeft: 10, color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20 }}>50 fixcoin</Text>
						</View>
						<Text style={{ textAlign: "center", marginTop: 10 }}>Cada fixcoin a $2300</Text>
					</View>
					<View style={{ flex: 0.5, borderColor: "#43AECC", borderWidth: 1, alignItems: "center", padding: 5, paddingVertical: 18, borderTopRightRadius: 7, borderBottomRightRadius: 7, }}>
						<Text style={{ color: "#43AECC", fontFamily: "Raleway-Bold", fontSize: 23, marginTop: -5 }}>$115000</Text>
						<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#47AAC9", paddingVertical: 3, paddingHorizontal: 15 }}
							title="COMPRAR" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12 }}
							containerStyle={{ marginTop: 10, alignItems: "flex-start" }}
							onPress={() => this.comprar(115000, 50, 4)} />
					</View>
				</View>

				<View>
					<Text style={{ color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20, marginHorizontal: 10, marginTop: 20 }}>Aprende a usar tus fixcoin</Text>

					<Text style={{ color: "#263762", fontFamily: "Raleway-Bold", marginHorizontal: 15, fontSize: 15, marginTop: 10, marginBottom: 5 }}>¿Qué es un fixcoin?</Text>

					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
						<Text style={{ marginStart: 5 }}>Los fixcoin son monedas virtuales para redimir por servicios.</Text>
					</View>

					<Text style={{ color: "#263762", fontFamily: "Raleway-Bold", marginHorizontal: 15, fontSize: 15, marginTop: 10, marginBottom: 5 }}>¿Cómo obtener fixcoin?</Text>

					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
						<Text style={{ marginStart: 5 }}>Los fixcoin los obtienes por la compra de un plan. Si se agotan antes del vencimiento de la membresía, puedes comprarlos por paquetes. Además tus buenas acciones serán premiadas: </Text>
					</View>

					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
						<Image source={require("../../assets/iconos/point.png")} style={{ width: 10, height: 10, marginTop: 3 }} />
						<Text style={{ marginStart: 5 }} >Si
						 <Text style={{ color: "#42AECB", fontWeight: "bold", textDecorationLine: "underline" }} onPress={() => this.amigos()}> refieres a un amigo</Text>  y se registra exitosamente ganarás 3 fixcoin.</Text>
					</View>

					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
						<Image source={require("../../assets/iconos/point.png")} style={{ width: 10, height: 10, marginTop: 3 }} />
						<Text style={{ marginStart: 5 }}>Si un cliente te califica con 4 o más estrellas ganarás 3 fixcoin.</Text>
					</View>

					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
						<Image source={require("../../assets/iconos/point.png")} style={{ width: 10, height: 10, marginTop: 3 }} />
						<Text style={{ marginStart: 5 }}>Por cada cliente que califiques ganarás 1 fixcoin.</Text>
					</View>

					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10 }}>
						<Image source={require("../../assets/iconos/point.png")} style={{ width: 10, height: 10, marginTop: 3 }} />
						<Text style={{ marginStart: 5 }}>Si redimes un cupón referido ganas 3 fixcoin. </Text>
					</View>


					<Text style={{ color: "#263762", fontFamily: "Raleway-Bold", marginHorizontal: 15, fontSize: 15, marginVertical: 10, marginBottom: 5 }}>¿Cómo se descuentan los fixcoin?</Text>


					<View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 5, marginTop: 10, }}>
						<Image source={require("../../assets/iconos/point.png")} style={{ width: 10, height: 10, marginTop: 3 }} />
						<Text style={{ marginStart: 5 }}>Cuando aceptas participar en un servicio se restará según categoría. Conoce los valores aquí. </Text>
					</View>
				</View>

				<Modal isVisible={this.state["isModalVisible"]} >
					<View style={{ marginVertical: 40, marginHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
						<View style={{ flexDirection: "row" }}>
							<View style={{ flex: 0.9, marginStart: 10, marginTop: 10 }}>
								<Text style={{ fontFamily: "Raleway-Bold", color: "#FFFFFF", fontSize: 20 }}>Costo de categorías</Text>
							</View>
							<View style={{ flexDirection: "row-reverse" }} >
								<Ionicons name="ios-close" size={50} color="#FFFFFF" onPress={this.toggleModal} />
							</View>
						</View>
						<ScrollView style={{ backgroundColor: "#ffffff", borderRadius: 10, padding: 10, }}>
							{(tariffs.length === 0) && <Text style={{ margin: 10 }}>cargando...</Text>}
							{tariffs.map((cat, i) => {
								return <Text key={i} style={{ marginHorizontal: 5, marginTop: 1, marginBottom: 20 }}> {cat["denomination"]}: <Text style={{ fontFamily: "Raleway-Bold", color: "#263762", fontSize: 15 }}>{cat["cost"]}</Text>  </Text>
							})}
						</ScrollView>
					</View>
				</Modal>

				<Text style={{ fontSize: 15, color: "#43AECC", fontFamily: "Raleway-Bold", textAlign: "center", marginTop: 10, marginBottom: 20, textDecorationLine: "underline" }}
					onPress={() => { this.verTarifas() }}>Ver tarifas por categorías</Text>
			</ScrollView>
		)
	}
}

/*{(this.props["navigation"].getParam("planUri") === "regalo") ?
					<View>
						<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
							<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 20, height: 20 }} />
							<Text style={{ marginStart: 10, fontSize: 15 }}>Recibe 20 fixcoins, estos te permitirán hacer servicios</Text>
						</View>
						<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
							<Image source={require("../../assets/iconos/activo.png")} style={{ width: 20, height: 20 }} />
							<Text style={{ marginStart: 10, fontSize: 15 }}>Activo en plataforma</Text>
						</View>
						<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
							<Image source={require("../../assets/iconos/capacitaciones.png")} style={{ width: 20, height: 20 }} />
							<Text style={{ marginStart: 10, fontSize: 15 }}>Capacitaciones</Text>
						</View>
					</View>
					: (this.props["navigation"].getParam("planUri") === "oro") ?
						<View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Estar activo en la plataforma</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Capacitaciones</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Visibilidad sobre Bronce</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Más fixcoin</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Sello Premium</Text>
							</View>
						</View> :
						<View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Estar activo en la plataforma</Text>
							</View>
							<View style={{ flexDirection: "row", marginTop: 20, marginHorizontal: 10, alignItems: "center" }}>
								<Icon name="check" size={20} color="#61A4BA" />
								<Text style={{ marginStart: 10, fontSize: 15 }}>Capacitaciones</Text>
							</View>
						</View>} */