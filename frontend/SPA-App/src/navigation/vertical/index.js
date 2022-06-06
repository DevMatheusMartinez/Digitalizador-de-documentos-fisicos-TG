import { FaUserTie, FaChartLine, FaCarAlt, FaFileAlt, FaUser } from "react-icons/fa"

export default [
  {
    id: 'users',
    title: 'Usuários',
    icon: <FaUserTie size={20} />,
    navLink: '/usuarios'
  },
  {
    id: 'files',
    title: 'Arquivos',
    icon: <FaFileAlt size={20} />,
    navLink: '/veiculos'
  }
]
