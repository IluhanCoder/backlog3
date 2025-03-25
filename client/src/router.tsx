import { Route } from "react-router-dom"
import FormComponent from "./forms/form-component"
import RegistationPage from "./auth/registration-page";
import ProjectsPage from "./project/projects-page";
import ProjectPage from "./project/project-page";
import MyProfilePage from "./user/my-profile-page";
import UserProfilePage from "./user/user-profile-page";
import KanBan from "./task/kanban";
import AnalyticsPage from "./analytics/analytics-page";
import EditRightsPage from "./project/edit-rights-page";
import WelcomePage from "./misc/welcome-page";
import EditProjectPage from "./project/edit-project-page";
import UserProjectStats from "./analytics/projects-stats";
import BacklogPage from "./backlogs/backlog-page";

const CustomRoutes = [
  <Route path="/" element={<WelcomePage/>} key="root"/>,
  <Route path="/registration" element={<RegistationPage/>} key="registration"/>,
  <Route path="/projects" element={<ProjectsPage/>} key="projects"/>,
  <Route path="/project/:projectId" element={<ProjectPage/>} key="project"/>,
  <Route path="/profile" element={<MyProfilePage/>} key="my-profile"/>,
  <Route path="/profile/:userId" element={<UserProfilePage/>}/>,
  <Route path="/analytics/:projectId" element={<AnalyticsPage/>}/>,
  <Route path="/rights/:projectId" element={<EditRightsPage/>}/>,
  <Route path="/settings/:projectId" element={<EditProjectPage/>}/>,
  <Route path="/projects-stats" element={<UserProjectStats/>}/>,
  <Route path="/backlog/:id/" element={<BacklogPage/>}/>
]

export default CustomRoutes;