import React, { Component } from 'react';
import { Text, View, ScrollView, Image, StyleSheet, AsyncStorage } from 'react-native';
import { Badge, Slider, Divider } from 'react-native-elements';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class ReportesTrabajosVista extends Component {
	constructor(props) {
		super(props), this.state = {
			textoAlert: "", showAlert: false,
			culminados: { mes: "", anno: "", total: "" },
			gastos: { mes: 0, anno: 0, total: 0 },
			aceptados: { mes: 0, anno: 0, total: 0 },
			rechazados: { mes: 0, anno: 0, total: 0 },
			perdidas: { mes: 0, anno: 0, total: 0 },
			castigos: { mes: 0, anno: 0, total: 0 },
			zonas: [],
			categorias: [],
			cant_servicios_zonas: 0,
			cant_servicios_categorias: 0
		}
	}
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + "fixperto/getReportesTrabajos", {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ expert: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					let reportes = responseJson.reportes;
					let cant_servicios_zonas = reportes["zonas"].reduce(function (total, currentValue) {
						return total + currentValue["servicios"];
					}, 0);
					let cant_servicios_categorias = reportes["categorias"].reduce(function (total, currentValue) {
						return total + currentValue["servicios"];
					}, 0);
					reportes["cant_servicios_zonas"] = cant_servicios_zonas;
					reportes["cant_servicios_categorias"] = cant_servicios_categorias;
					this.setState(reportes);
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	render() {
		const { culminados, gastos, aceptados, rechazados, perdidas, castigos, zonas, categorias, cant_servicios_zonas, cant_servicios_categorias } = this.state;
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

				<View style={{ backgroundColor: "#EAF9D9", flexDirection: "row", padding: 20, alignItems: "center", }}>
					<View style={{ flex: 0.3, alignItems: "center" }}>
						<Image source={require("../../assets/iconos/reporte_trabajos.png")} style={{ width: 50, height: 60 }} />
					</View>

					<View style={{ flex: 0.9 }}>
						<View style={{ backgroundColor: "#EAF9D9", marginHorizontal: 15, }}>
							<Text style={{ color: "#86CA3D", fontFamily: "Raleway-Bold" }}>Observa el progreso que has tenido a lo largo del tiempo y de acuerdo a tu aceptación de solicitudes</Text>
						</View>
					</View>


				</View>

				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20 }}>
						<Image source={require("../../assets/iconos/acepted.png")} style={{ width: 20, height: 20 }} />
						<Text style={styles.textPrincipal}>Trabajos Culminados</Text>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={culminados["mes"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este mes</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={culminados["anno"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este año</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={culminados["total"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>En total</Text>
						</View>
					</View>
				</View>

				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20 }}>
						<Image source={require("../../assets/iconos/gastos_fixcoin.png")} style={{ width: 20, height: 20 }} />
						<Text style={styles.textPrincipal}>Gasto de fixcoin</Text>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={gastos["mes"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este mes</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={gastos["anno"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este año</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={gastos["total"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>En total</Text>
						</View>
					</View>
				</View>

				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20 }}>
						<Image source={require("../../assets/iconos/aceptacion_ofertas.png")} style={{ width: 21, height: 21 }} />
						<Text style={styles.textPrincipal}>Aceptación de ofertas</Text>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={aceptados["mes"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este mes</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={aceptados["anno"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este año</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={aceptados["total"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>En total</Text>
						</View>
					</View>
				</View>

				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20 }}>
						<Image source={require("../../assets/iconos/ofertas_rechazadas.png")} style={{ width: 18, height: 18 }} />
						<Text style={styles.textPrincipal}>Ofertas rechazadas</Text>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={rechazados["mes"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este mes</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={rechazados["anno"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este año</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={rechazados["total"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>En total</Text>
						</View>
					</View>
				</View>

				{/*	<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20 }}>
						<Image source={require("../../assets/iconos/perdidas_oportunidades.png")} style={{ width: 20, height: 20 }} />
						<Text style={styles.textPrincipal}>Pérdida de oportunidades</Text>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={perdidas["mes"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este mes</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={perdidas["anno"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este año</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={perdidas["total"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>En total</Text>
						</View>
					</View>
				</View>

				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20 }}>
						<Image source={require("../../assets/iconos/cantidad_castigos.png")} style={{ width: 20, height: 20 }} />
						<Text style={styles.textPrincipal}>Cantidad de castigos</Text>
					</View>
					<View style={{ flexDirection: "row", marginTop: 10 }}>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={castigos["mes"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este mes</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={castigos["anno"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>Este año</Text>
						</View>
						<View style={{ flex: 0.33, alignItems: "center" }}>
							<Badge status="primary" value={castigos["total"]} badgeStyle={styles.badge} textStyle={styles.textBadge} />
							<Text>En total</Text>
						</View>
					</View>
				</View>*/}

				<Divider></Divider>
				<View style={{ marginVertical: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20, marginBottom: 10 }}>
						<Image source={require("../../assets/iconos/zonas_activas.png")} style={{ width: 20, height: 20, }} />
						<Text style={styles.textPrincipal}>Zonas más activas</Text>
					</View>
					<View>
						{zonas.map((zona, index) => {
							return <View key={index} style={{ marginHorizontal: 30, marginBottom: 15 }}>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ flex: 0.7, fontFamily: "Raleway-Bold", color: "#5A5A5A" }}>{zona["region"]}</Text>
									<Text style={{ flex: 0.3, textAlign: "right" }}>{zona["servicios"]} servicios</Text>
								</View>
								{/*	<Slider
										disabled
										trackStyle={{ height: 20, borderRadius: 10, backgroundColor: "#273861" }}
										thumbTintColor="#273861" maximumValue={cant_servicios_zonas}
										thumbStyle={{ backgroundColor: "#273861", borderRadius: 0 }}
										maximumTrackTintColor='silver'
										minimumTrackTintColor='#273861'
										value={zona["servicios"]} />*/}
							</View>
						})}
					</View>
				</View>

				<View style={{ marginBottom: 15 }}>
					<View style={{ flexDirection: "row", padding: 10, alignItems: "center", marginLeft: 20, marginBottom: 10 }}>
						<Image source={require("../../assets/iconos/activo.png")} style={{ width: 20, height: 20 }} />
						<Text style={styles.textPrincipal}>Categorías más activas</Text>
					</View>
					<View>
						{categorias.map((categoria, index) => {
							return <View key={index} style={{ marginHorizontal: 30, marginBottom: 15 }}>
								<View style={{ flexDirection: "row" }}>
									<Text style={{ flex: 0.7, fontFamily: "Raleway-Bold", color: "#5A5A5A" }}>{categoria["categoria"]}</Text>
									<Text style={{ flex: 0.3, textAlign: "right" }}>{categoria["servicios"]} servicios</Text>
								</View>
								{/*<Slider
										disabled
										trackStyle={{ height: 20, borderRadius: 10, backgroundColor: "#273861" }}
										thumbTintColor="#273861" maximumValue={cant_servicios_zonas}
										thumbStyle={{ backgroundColor: "#273861", borderRadius: 0 }}
										maximumTrackTintColor='silver'
										minimumTrackTintColor='#273861'
										value={categoria["servicios"]} />*/}
							</View>
						})}
					</View>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	badge: { width: 30, height: 30, backgroundColor: "#F0F9FB", marginBottom: 10 },
	textBadge: { fontSize: 15, color: "#61BBD4" },
	textPrincipal: { marginLeft: 5, fontFamily: "Raleway-Bold", fontSize: 18, color: "#273861" }
})