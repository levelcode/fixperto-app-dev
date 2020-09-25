import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import { general, statusVista } from "../style/request";

export default function StatusOfertaVista({ offert, type }) {
	return (


		<ScrollView style={[general.cont3]}>

			<View style={{ marginTop: 25 }}>

				<View style={[statusVista.cont_title]}>
					<Image source={require("../assets/iconos/calendar.png")} style={{ width: 20, height: 20 }} />

					<Text style={[statusVista.cont_title_text]}>Creación de oferta</Text>
				</View>

				<View style={[general.cont_general]}>
					<View style={{ flex: 0.20 }}>
						<Image source={require("../assets/iconos/activo.png")} style={{ width: 20, height: 20, marginLeft: 40, marginTop: 20 }} />
					</View>

					<View style={{ flex: 0.80 }}>
						<Text style={{ margin: 20, fontSize: 15 }}>Fecha del servicio: {(offert.start_date) ? offert.start_date : "Pendiente"}</Text>
					</View>
				</View>

			</View>

			{
				(type === "scheduled" || type === "completed") ?
					<View style={{ backgroundColor: "#F2F2F2" }}>

						<View style={[statusVista.cont_title]}>
							<Image source={require("../assets/iconos/calendar.png")} style={{ width: 20, height: 20 }} />

							<Text style={[statusVista.cont_title_text]}>Oferta agendada</Text>
						</View>

						<View style={[general.cont_general]}>
							<View style={{ flex: 0.20 }}>
								<Image source={require("../assets/iconos/activo.png")} style={{ width: 20, height: 20, marginLeft: 40, marginTop: 20 }} />
							</View>

							<View style={{ flex: 0.80 }}>
								<Text style={{ margin: 20, fontSize: 15 }}>Fecha del servicio: {(offert.start_date) ? offert.start_date : "Pendiente"}</Text>
							</View>
						</View>

					</View>
					: null
			}

			{
				(type === "completed") ?
					<View style={{ backgroundColor: "#F2F2F2" }}>

						<View style={[statusVista.cont_title]}>
							<Image source={require("../assets/iconos/calendar.png")} style={{ width: 20, height: 20 }} />

							<Text style={[statusVista.cont_title_text]}>Oferta completada</Text>
						</View>

						<View style={[general.cont_general]}>
							<View style={{ flex: 0.20 }}>
								<Image source={require("../assets/iconos/activo.png")} style={{ width: 20, height: 20, marginLeft: 40, marginTop: 20 }} />
							</View>

							<View style={{ flex: 0.80 }}>
								<Text style={{ margin: 20, fontSize: 15 }}>Fecha finalizada: {(offert.end_date) ? offert.end_date : "Pendiente"}</Text>
							</View>
						</View>

					</View>
					: null
			}
		</ScrollView >
	)
}