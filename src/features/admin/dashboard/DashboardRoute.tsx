import { useNavigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

export default function DashboardRoute() {
    const navigate = useNavigate();

    return (
        <DashboardPage
            onNavigate={(view) => navigate(`/dashboard/${view}`)}
            onReviewStory={(id) => navigate(`/dashboard/pending/${id}`)}
        />
    );
}