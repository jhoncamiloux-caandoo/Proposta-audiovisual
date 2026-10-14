import { ImageResponse } from "next/og";
export const alt = "Proposta audiovisual para a FSB Holding | Jhon Camilo Rios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() { return new ImageResponse(<div style={{background:"#dcd2ee",color:"#261936",width:"100%",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:70}}><div style={{fontSize:24}}>Jhon Camilo Rios · Proposta audiovisual</div><div style={{fontSize:76,lineHeight:1.05}}>Histórias bem editadas comunicam melhor.</div><div style={{fontSize:28}}>FSB Holding · 14 vídeos institucionais</div></div>,size); }
