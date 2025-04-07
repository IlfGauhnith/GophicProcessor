const apiUrl = process.env.NEXT_PUBLIC_GOPHIC_PROCESSOR_API_URL as string;

if (!apiUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_GOPHIC_PROCESSOR_API_URL is not defined.");
}

interface JobResponse {
  job_id: string;
}

export async function sendJob(
  imageBase64: string,
  algorithm: string,
  targetWidth: number,
  targetHeight: number
): Promise<JobResponse> {

  // Retrieve the auth token from local storage.
  const token = localStorage.getItem("authToken");

  // Build the request body.
  const body = {
    images: [imageBase64],
    algorithm,
    targetWidth,
    targetHeight,
  };

  // Make the API request.
  const response = await fetch(`${apiUrl}/resize-images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Job submission failed.");
  }

  return await response.json();
}

interface JobStatusResponse {
  job_uuid: string;
  status: "Completed" | "In Progress" | "NotFound" | string;
  // add any other properties if needed
}

/**
 * Sends a GET request to check the status of a job.
 * Assumes the endpoint is: `${apiUrl}/jobs/{jobId}`
 */
export async function checkJobStatus(jobId: string): Promise<JobStatusResponse> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${apiUrl}/resize-images/status/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  // If a 404 is received, return a special value instead of throwing.
  if (response.status === 404) {
    return { job_uuid: "", status: "NotFound" };
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Job status check failed.");
  }

  return response.json();
}

export async function pollJobStatus(
  jobId: string,
  interval: number = 2000,
  timeout: number = 300000 // 5 minutes
): Promise<string> {
  const startTime = Date.now();
  while (true) {
    const statusData = await checkJobStatus(jobId);
    // If the job is completed, return the status.
    if (statusData.status === "Completed") {
      return jobId;
    }
    // If the job isn't found yet, continue polling.
    if (statusData.status === "NotFound") {
      // Continue polling.
    }
    // Check if we've exceeded the timeout.
    if (Date.now() - startTime > timeout) {
      throw new Error("Job polling timed out");
    }
    // Wait for the next interval.
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

export async function getJobResult(jobId: string): Promise<{ images: string[] }> {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${apiUrl}/resize-images/${jobId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Job download failed.");
  }

  return response.json();
}