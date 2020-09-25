import React from 'react';
import { Image, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { general, info } from "../style/request";
import { url } from "./config";
export default function ExpertoVista({ experto, navigation }) {
	const typo = (experto["type"] === 0) ? "profesional/" : (experto["type"] === 1) ? "empresa/" : experto["type"];
	let response_time = "";
	if (experto["emergency"] === 1) {
		let hora = experto["response_time"].split(":");
		response_time = hora[0] + "h " + hora[1] + " min";
	}
	return (
		<TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={() => navigation.navigate("DatosExperto", { expert: (experto["type"]) ? experto["typeId"] : experto["id"] })}>
			<View style={{ flex: 0.25, borderRadius: 5, alignItems: "center", marginVertical: 5 }}>
				<Image
					style={{ left: 10, width: 90, height: 90, borderRadius: 10 }}
					source={{ uri: url + "uploads/registros/" + typo + "/" + experto["avatar"] }}>
				</Image>
			</View>
			<View style={{ flex: 0.75, paddingLeft: 30, }}>
				<View style={{ flex: 1, flexDirection: "row" }}>
					<View style={{ flex: 0.7, marginBottom: 10 }}>
						{experto.plan === 1 &&
							<Image source={require("../assets/iconos/experto_premium.png")} style={{ width: 100, height: 20 }} />}
					</View>
					<View style={{ flex: 0.3 }}>
						{
							(experto.evaluation) ?
								<Text style={[{ marginHorizontal: 0 }]}>
									<Ionicons name="ios-star" size={15} color="#FFCE07" />
									{experto.evaluation}
								</Text>
								:
								<View>
									<Text></Text>
									<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
										<Ionicons name="ios-star" size={15} color="#FFCE07" /> Sin
								</Text>
									<Text style={[{ marginHorizontal: 0, fontSize: 10 }]}>
										calificación
								</Text>
								</View>
						}
					</View>
				</View>
				<Text style={[info.cont_text_title]}>{experto.name}</Text>
				<View style={[general.cont4, { flexDirection: "row", alignItems: "center" }]}>
					{(experto.type === 0 && experto.salud_pension) && <View style={{ flexDirection: "row" }}>
						<Ionicons name="ios-checkmark-circle" size={15} color="#8FB464" />
						<Text style={[info.cont_text_title_cat, { marginLeft: 5 }]}>Parafiscales</Text>
					</View>
					}
					{(experto.type === 0 && experto.arl) && <View style={{ flexDirection: "row" }}>
						<Ionicons name="ios-checkmark-circle" size={15} color="#8FB464" style={{ marginStart: 15 }} />
						<Text style={[info.cont_text_title_cat, { marginLeft: 5 }]}>ARL</Text>
					</View>
					}
				</View>
				{/*experto.insured === 1 && <View style={{ flexDirection: "row", marginVertical: 5, alignItems: "center" }}>
					<Image source={require("../assets/iconos/asegurado.png")} style={{ width: 20, height: 20 }} />
					<Text style={{ marginStart: 5 }}>Asegurado</Text>
				</View>
				*/}
				<Text style={[{ textAlign: "right", marginBottom: 10, marginRight: 30, fontFamily: "Raleway-Bold", fontSize: 18, color: "#293763", marginTop: 10, display: (experto["emergency"] === 1) ? "flex" : "none" }]}>  <Image source={require("../assets/iconos/emergencia.png")} style={{ width: 15, height: 20 }} /> {response_time}</Text>
			</View>
		</TouchableOpacity>
	)
}