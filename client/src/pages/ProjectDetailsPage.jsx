import { useParams } from "react-router-dom";

function ProjectDetailsPage() {
  const { projectId } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Project Details</h1>
      <p>Project ID from URL: {projectId}</p>
      <p>This page will show tasks for this project.</p>
    </div>
  );
}

export default ProjectDetailsPage;
