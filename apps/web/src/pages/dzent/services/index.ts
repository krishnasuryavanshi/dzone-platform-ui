import { apiClient } from '@dzone/shared-auth';
import { ApiHost, ApiResources } from '@dzone/shared-lib';
import { transformPath } from '@dzone/shared-lib';

// Fetch conversation list (titles)
export async function fetchConversations() {
  try {
    const { data } = await apiClient.get(
      `${ApiHost.PlatformService}/${ApiResources.AiTitle}`,
    );
    return data;
  } catch {
    return { data: [] };
  }
}

// Fetch single conversation by ID
export async function fetchConversationById(conversationId: string) {
  try {
    const resource = transformPath(ApiResources.AiConversations, {
      conversationId,
    });
    const { data } = await apiClient.get(
      `${ApiHost.PlatformService}/${resource}`,
    );
    return data;
  } catch {
    return { data: [] };
  }
}

// Post user message to AI copilot
export async function postUserMessage(requestData: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post(
      `${ApiHost.AICopilotService}/${ApiResources.DzentPostUserMessage}`,
      requestData,
    );
    return data;
  } catch (error) {
    throw new Error(`Failed to post user message: ${error}`);
  }
}

// Submit feedback on agent response
export async function submitFeedback(requestData: Record<string, unknown>) {
  try {
    const { data } = await apiClient.post(
      `${ApiHost.PlatformService}/${ApiResources.AiAgentFeedback}`,
      requestData,
    );
    return data;
  } catch (error) {
    throw new Error(`Failed to submit feedback: ${error}`);
  }
}

// Fetch initial actions — currently mocked
export async function fetchInitialActions() {
  // TODO: Replace with real API call when backend endpoint is ready
  return {
    data: [
      { label: 'Create new campaign', value: 'create_new_campaign' },
      { label: 'Edit campaign', value: 'edit_campaign' },
      { label: 'Clone Campaign', value: 'clone_campaign' },
    ],
  };
}

// Fetch conversation files — currently mocked
export async function fetchConversationFiles(_id: string) {
  // TODO: Replace with real API call when backend endpoint is ready
  return {
    data: [
      { id: '1', name: 'example.txt', size: '1MB', type: 'document' },
      { id: '2', name: 'image.png', size: '2MB', type: 'image' },
    ],
  };
}
