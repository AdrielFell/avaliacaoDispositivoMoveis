import { View, Button } from "react-native";
import { Link } from "expo-router";

export default function Home() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Link href="/crudFilmes" asChild>
          <Button title="Ir para Meus-Filmes"/>
        </Link>
      </View>
      
    );
}