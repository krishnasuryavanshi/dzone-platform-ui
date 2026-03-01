import { cloneDeep } from 'lodash-es';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { usePermissionsStore } from '@dzone/shared-store';
import { formatChatSummary } from '../lib/utils';
import {
  fetchConversationById,
  fetchConversations,
  postUserMessage,
} from '../services';

type DzRecord = Record<string, any>;

interface DzentStore {
  chatSummary: {
    progress?: number;
    campaign?: DzRecord | null;
    lineItems?: DzRecord | DzRecord[] | null;
  } | null;

  chatStatus: 'Idle' | 'InProgress' | null;
  setChatStatus: (status: DzentStore['chatStatus']) => void;

  idleActions: DzRecord[];
  systemMessage: DzRecord[] | null;
  userMessage: DzRecord | null;
  userMessageError: boolean;
  isWaitingForResponse: boolean;
  disableFileUpload: boolean;
  disableTextInput: boolean;
  footerInputPlaceholder: string;
  tenantCode: string | null;
  conversationId: string | null;
  conversationTitle: string | null;
  marketerId: string | null;
  userId: string | null;
  campaignCreationInProgress: boolean;

  chatHistory: DzRecord[] | null;
  activeHistoricalConversation: DzRecord | null;
  userPrefilledMessage: string;
  currentFeedback: DzRecord | null;
  currentFeedbackGiven: 'up' | 'down' | null;
  setCurrentFeedbackGiven: (feedback: 'up' | 'down') => void;

  fetchChatHistory: (newConversation?: DzRecord) => Promise<void>;
  clearUserPrefilledMessage: () => void;
  fetchConversationDetails: (conversation: DzRecord) => Promise<void>;
  setActiveHistoricalConversation: (conversation: DzRecord | null) => void;
  initiateChatSetup: () => Promise<void>;

  initializeChat: () => Promise<void>;
  setTenantCode: (tenantCode: string | null) => void;
  setStoreStateAfterSuccessfulResponse: (data: DzRecord) => Promise<boolean>;
  handleUserMessage: (userMessageData: DzRecord) => Promise<DzRecord>;

  conversation: DzRecord[];
  pushMessageToConversation: (conversation: DzRecord) => void;

  marketerList: DzRecord[] | null;
  setMarketerList: (marketerList: DzRecord[] | null) => void;

  resetAll: () => void;
}

export const useDzentStore = create<DzentStore>()(
  immer((set, get) => ({
    chatSummary: null,
    chatStatus: 'Idle',
    idleActions: [],
    systemMessage: null,
    userMessage: null,
    conversation: [],
    userMessageError: false,
    isWaitingForResponse: false,
    disableFileUpload: true,
    disableTextInput: true,
    footerInputPlaceholder: 'Create new campaigns.',
    tenantCode: null,
    conversationId: null,
    conversationTitle: null,
    marketerId: null,
    userId: null,
    campaignCreationInProgress: false,

    chatHistory: [],
    activeHistoricalConversation: null,
    currentFeedback: null,
    currentFeedbackGiven: null,

    setCurrentFeedbackGiven: (feedback: 'up' | 'down') => {
      set({ currentFeedbackGiven: feedback });
    },

    marketerList: null,
    setMarketerList: (marketerList: DzRecord[] | null) => {
      set({ marketerList });
    },
    userPrefilledMessage: '',

    clearUserPrefilledMessage: () => {
      set({ userPrefilledMessage: '' });
    },

    initiateChatSetup: async () => {
      set({ isWaitingForResponse: true });

      try {
        await get().fetchChatHistory();
      } catch {
        // silent
      }
    },

    initializeChat: async () => {
      set({
        chatStatus: 'InProgress',
        conversation: [],
        systemMessage: null,
        userMessage: null,
        userMessageError: false,
        isWaitingForResponse: true,
      });

      const modules = usePermissionsStore.getState().modules;

      try {
        const requestData = {
          conversationId: null,
          tenantCode: get().tenantCode,
          state: null,
          userMessage: null,
          modules,
        };
        const { data } = await postUserMessage(requestData);
        const conversation = {
          conversationId: data?.conversationId,
          title: data?.conversationTitle,
        };

        set({ activeHistoricalConversation: conversation });
        set({
          chatHistory: [conversation, ...(get().chatHistory || [])],
        });

        await get().setStoreStateAfterSuccessfulResponse(data);
        return data;
      } catch {
        // silent
      }
    },

    fetchChatHistory: async () => {
      try {
        const { data } = await fetchConversations();
        if (data?.length) {
          const recentChat = data[0];
          const marketerList = get().marketerList || [];
          if (marketerList.length === 1 && recentChat?.title === 'Untitled') {
            set({ activeHistoricalConversation: recentChat });
            await get().fetchConversationDetails(recentChat);
          } else {
            await get().initializeChat();
          }
          set({ chatHistory: [...data] });
        } else {
          set({ chatHistory: [] });
          await get().initializeChat();
        }
      } catch {
        // silent
      }
    },

    fetchConversationDetails: async (conversation: DzRecord) => {
      try {
        const { data } = await fetchConversationById(
          conversation.conversationId,
        );
        const conversations: DzRecord[] = [];
        if (data?.length) {
          data.map((record: DzRecord) => {
            const chatMessage = {
              type: record.role === 'user' ? 'user' : 'system',
              message:
                record.role === 'system'
                  ? record.content?.fields
                  : {
                      userMessage: record.content?.userMessage,
                      fields: record.content?.fields || [],
                    },
              timestamp: record.createdAt,
            };
            conversations.unshift(chatMessage);
          });
        }

        const lastSystemMessage = data
          .slice()
          .find((record: DzRecord) => record.role === 'system');

        const chatSummary = formatChatSummary(
          lastSystemMessage?.content?.summary,
        );

        set({
          conversation: conversations,
          conversationId: conversation.conversationId,
          conversationTitle: conversation.title,
          chatSummary: chatSummary,
          systemMessage: null,
          userMessage: null,
          disableFileUpload: true,
          disableTextInput: false,
          campaignCreationInProgress: false,
          isWaitingForResponse: false,
        });
      } catch {
        // silent
      }
    },

    setActiveHistoricalConversation: (conversation: DzRecord | null) => {
      set({ activeHistoricalConversation: conversation });
      if (conversation) {
        get().fetchConversationDetails(conversation);
      }
    },

    setChatStatus: (status: DzentStore['chatStatus']) => {
      set({ chatStatus: status });
    },

    pushMessageToConversation: (conversation: DzRecord) => {
      set((state) => {
        state.conversation.push(conversation);
      });
    },

    setStoreStateAfterSuccessfulResponse: async (data: DzRecord) => {
      const actionsInSystemMessage = data?.fields || [];
      const footerInputPlaceholder =
        (actionsInSystemMessage.length === 1 &&
          actionsInSystemMessage[0]?.field?.label &&
          `Enter ${actionsInSystemMessage[0]?.field?.label}`) ||
        'Enter your message here';

      const chatSummary = formatChatSummary(data?.summary);

      const historicalConversation = {
        conversationId: data?.conversationId || null,
        title: data?.conversationTitle || null,
      };

      const existingHistory = get().chatHistory || [];
      const updatedHistory = existingHistory.map((chat) =>
        chat.conversationId === historicalConversation.conversationId
          ? { ...chat, title: historicalConversation.title }
          : chat,
      );

      if (existingHistory.length && updatedHistory) {
        set({ chatHistory: updatedHistory });
      }

      set({
        conversationId: data?.conversationId || null,
        conversationTitle: data?.conversationTitle || null,
        marketerId: data?.marketerId || null,
        userId: data?.userId || null,
        systemMessage: data?.fields,
        userMessage: null,
        chatSummary,
        isWaitingForResponse: false,
        disableFileUpload: data.disableFileUpload,
        disableTextInput: data.disableTextInput,
        footerInputPlaceholder,
        campaignCreationInProgress: data?.campaignCreationInProgress || false,
        userPrefilledMessage: data?.userPrefilledMessage || '',
        currentFeedback: data?.feedback || null,
        currentFeedbackGiven: null,
        activeHistoricalConversation: historicalConversation,
      });

      return true;
    },

    handleUserMessage: async (userMessageData: DzRecord) => {
      const {
        systemMessage,
        conversation,
        conversationId,
        tenantCode,
        currentFeedback,
        currentFeedbackGiven,
      } = get();
      const originalSystemMessage = cloneDeep(systemMessage);
      let systemMessageWithoutAction = systemMessage;
      if (systemMessageWithoutAction) {
        systemMessageWithoutAction = systemMessageWithoutAction.map(
          ({ message }: DzRecord) => {
            return { message };
          },
        );
      }

      set({
        systemMessage: systemMessageWithoutAction,
        userMessage: userMessageData,
        userMessageError: false,
        chatStatus: 'InProgress',
        isWaitingForResponse: true,
        disableFileUpload: true,
        disableTextInput: true,
        footerInputPlaceholder: '',
      });

      const modules = usePermissionsStore.getState().modules;

      try {
        const requestData = {
          conversationId,
          tenantCode,
          modules,
          ...userMessageData,
        };
        const { data } = await postUserMessage(requestData);

        if (systemMessageWithoutAction) {
          conversation.push({
            type: 'system',
            message: systemMessageWithoutAction,
            feedback: currentFeedback,
            feedbackGiven: currentFeedbackGiven,
          });
        }

        conversation.push({ type: 'user', message: userMessageData });

        if (data?.newChat) {
          const newConversationItem = {
            conversationId: data?.conversationId,
            title: data?.conversationTitle,
          };

          set({
            activeHistoricalConversation: newConversationItem,
            conversation: [],
            chatHistory: [newConversationItem, ...(get().chatHistory || [])],
          });
        }

        await get().setStoreStateAfterSuccessfulResponse(data);
        return data;
      } catch {
        set({
          systemMessage: originalSystemMessage,
          userMessage: null,
          userMessageError: true,
          isWaitingForResponse: false,
          disableFileUpload: true,
          disableTextInput: true,
          footerInputPlaceholder: '',
        });
      }
    },

    setTenantCode: (tenantCode: string | null) => {
      set({ tenantCode });
    },

    resetAll: () => {
      set({
        chatSummary: null,
        chatStatus: 'Idle',
        idleActions: [],
        systemMessage: null,
        userMessage: null,
        conversation: [],
        tenantCode: null,
        conversationId: null,
        conversationTitle: null,
        marketerId: null,
        userId: null,
        userMessageError: false,
        isWaitingForResponse: false,
        disableFileUpload: true,
        disableTextInput: true,
        footerInputPlaceholder: 'Create new campaigns.',
        marketerList: null,
        userPrefilledMessage: '',
        currentFeedback: null,
        currentFeedbackGiven: null,
      });
    },
  })),
);
