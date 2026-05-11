// === Repositorios ===
import { ApiGroupRepository } from '../data/repositories/ApiGroupRepository';
import { FirestoreChatRepository } from '../data/repositories/FirestoreChatRepository';
import { FirestoreGroupChatRepository } from '../data/repositories/FirestoreGroupChatRepository';
import { ApiProfileRepository } from '../data/repositories/ApiProfileRepository';
import { ApiSearchRepository } from '../data/repositories/ApiSearchRepository';
import { ApiEventRepository } from '../data/repositories/ApiEventRepository';
import { ApiAcademicRepository } from '../data/repositories/ApiAcademicRepository';

// === Use Cases: Group ===
import { CreateGroup } from '../application/use-cases/group/CreateGroup';
import { GetUserGroups } from '../application/use-cases/group/GetUserGroups';
import { GetGroupDetail } from '../application/use-cases/group/GetGroupDetail';
import { JoinGroup } from '../application/use-cases/group/JoinGroup';
import { ProcessRequest } from '../application/use-cases/group/ProcessRequest';
import { TransferAdmin } from '../application/use-cases/group/TransferAdmin';
import { RemoveMember } from '../application/use-cases/group/RemoveMember';
import { AddMember } from '../application/use-cases/group/AddMember';
import { LeaveGroup } from '../application/use-cases/group/LeaveGroup';
import { GetAvailableStudents } from '../application/use-cases/group/GetAvailableStudents';
import { RespondToAdminTransfer } from '../application/use-cases/group/RespondToAdminTransfer';
import { RequestAdminTransfer } from '../application/use-cases/group/RequestAdminTransfer';

// === Use Cases: Chat ===
import { SendMessage } from '../application/use-cases/chat/SendMessage';
import { SendFileMessage } from '../application/use-cases/chat/SendFileMessage';
import { GetOrCreateChat } from '../application/use-cases/chat/GetOrCreateChat';
import { SendGroupMessage } from '../application/use-cases/chat/SendGroupMessage';
import { SendGroupFileMessage } from '../application/use-cases/chat/SendGroupFileMessage';

// === Use Cases: Profile ===
import { GetProfile } from '../application/use-cases/profile/GetProfile';
import { GetFullProfile } from '../application/use-cases/profile/GetFullProfile';
import { SaveProfile } from '../application/use-cases/profile/SaveProfile';

// === Use Cases: Search ===
import { SearchStudents } from '../application/use-cases/search/SearchStudents';
import { SearchGroups } from '../application/use-cases/search/SearchGroups';

// === Use Cases: Event ===
import { GetEvents } from '../application/use-cases/event/GetEvents';
import { GetEventCategories } from '../application/use-cases/event/GetEventCategories';
import { SubscribeToCategory } from '../application/use-cases/event/SubscribeToCategory';
import { UnsubscribeFromCategory } from '../application/use-cases/event/UnsubscribeFromCategory';
import { GetSubscribedCategories } from '../application/use-cases/event/GetSubscribedCategories';


// === Use Cases: Academic ===
import { GetCareers } from '../application/use-cases/academic/GetCareers';
import { GetCareerStructure } from '../application/use-cases/academic/GetCareerStructure';
import { GetSubjects } from '../application/use-cases/academic/GetSubjects';

// ─── Instancias de Repositorios ─────────────────────────────────────
const groupRepo = new ApiGroupRepository();
const chatRepo = new FirestoreChatRepository();
const groupChatRepo = new FirestoreGroupChatRepository();
const profileRepo = new ApiProfileRepository();
const searchRepo = new ApiSearchRepository();
const eventRepo = new ApiEventRepository();
const academicRepo = new ApiAcademicRepository();

// ─── Instancias de Use Cases ────────────────────────────────────────
// Group
export const createGroup = new CreateGroup(groupRepo);
export const getUserGroups = new GetUserGroups(groupRepo);
export const getGroupDetail = new GetGroupDetail(groupRepo);
export const joinGroup = new JoinGroup(groupRepo);
export const processRequest = new ProcessRequest(groupRepo);
export const transferAdmin = new TransferAdmin(groupRepo);
export const removeMember = new RemoveMember(groupRepo);
export const addMember = new AddMember(groupRepo);
export const leaveGroup = new LeaveGroup(groupRepo);
export const getAvailableStudents = new GetAvailableStudents(groupRepo);
export const respondToAdminTransfer = new RespondToAdminTransfer(groupRepo);
export const requestAdminTransfer = new RequestAdminTransfer(groupRepo);

// Chat
export const sendMessage = new SendMessage(chatRepo);
export const sendFileMessage = new SendFileMessage(chatRepo);
export const getOrCreateChat = new GetOrCreateChat(chatRepo);
export const sendGroupMessage = new SendGroupMessage(groupChatRepo);
export const sendGroupFileMessage = new SendGroupFileMessage(groupChatRepo);

// Profile
export const getProfile = new GetProfile(profileRepo, academicRepo);
export const getFullProfile = new GetFullProfile(profileRepo, academicRepo);
export const saveProfile = new SaveProfile(profileRepo);

// Search
export const searchStudents = new SearchStudents(searchRepo);
export const searchGroups = new SearchGroups(searchRepo);

// Event
export const getEvents = new GetEvents(eventRepo);
export const getEventCategories = new GetEventCategories(eventRepo);
export const subscribeToCategory = new SubscribeToCategory(eventRepo);
export const unsubscribeFromCategory = new UnsubscribeFromCategory(eventRepo);
export const getSubscribedCategories = new GetSubscribedCategories(eventRepo);


// Academic
export const getCareers = new GetCareers(academicRepo);
export const getCareerStructure = new GetCareerStructure(academicRepo);
export const getSubjects = new GetSubjects(academicRepo);

// Re-export del chat repo para suscripciones directas en hooks
export { chatRepo, groupChatRepo };