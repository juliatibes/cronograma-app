import { FC } from "react";
import SideMenu from "../../components/SideMenu";
import Calendario from "../../components/Calendario";

const Cronograma: FC = () => {


return(
<main> 
    <SideMenu />
    <h1>Calendário de Eventos</h1>
    <Calendario />
</main>

)


}

export default Cronograma;