import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorMiddleware';

export class GroupController {
  private createGroupUC: any;
  private getUserGroupsUC: any;
  private getGroupByIdUC: any;
  private searchGroupsUC: any;
  private checkGroupNameUniqueUC: any;
  private sendJoinRequestUC: any;
  private getGroupRequestsUC: any;
  private handleRequestActionUC: any;
  private removeMemberUC: any;
  private transferAdminUC: any;
  private addMemberUC: any;
  private leaveGroupUC: any;
  private getAvailableStudentsUC: any;
  private deleteUserRequestsUC: any;
  private requestAdminTransferUC: any;
  private handleAdminTransferResponseUC: any;
  private static instance: GroupController;

  constructor(useCases: any) {
    this.createGroupUC = useCases.createGroup;
    this.getUserGroupsUC = useCases.getUserGroups;
    this.getGroupByIdUC = useCases.getGroupById;
    this.searchGroupsUC = useCases.searchGroups;
    this.checkGroupNameUniqueUC = useCases.checkGroupNameUnique;
    this.sendJoinRequestUC = useCases.sendJoinRequest;
    this.getGroupRequestsUC = useCases.getGroupRequests;
    this.handleRequestActionUC = useCases.handleRequestAction;
    this.removeMemberUC = useCases.removeMember;
    this.transferAdminUC = useCases.transferAdmin;
    this.addMemberUC = useCases.addMember;
    this.leaveGroupUC = useCases.leaveGroup;
    this.getAvailableStudentsUC = useCases.getAvailableStudents;
    this.deleteUserRequestsUC = useCases.deleteUserRequests;
    this.requestAdminTransferUC = useCases.requestAdminTransfer;
    this.handleAdminTransferResponseUC = useCases.handleAdminTransferResponse;
  }

  createGroup = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.createGroupUC.execute(req.body);
    res.status(201).json(result);
  });

  getUserGroups = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const role = req.query.role as string;
    const groups = await this.getUserGroupsUC.execute(userId, role);
    res.json(groups);
  });

  getGroupById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    const group = await this.getGroupByIdUC.execute(req.params.id, userId);
    if (!group) {
        throw new Error('GROUP_NOT_FOUND');
    }
    res.json(group);
  });

  searchGroups = asyncHandler(async (req: Request, res: Response) => {
    const { subjectId, search, userSubjectIds, userId } = req.query;
    const groups = await this.searchGroupsUC.execute({
      subjectId: subjectId as string,
      search: search as string,
      userSubjectIds: userSubjectIds as string,
      userId: userId as string
    });
    res.json(groups);
  });

  checkGroupNameUnique = asyncHandler(async (req: Request, res: Response) => {
    const isUnique = await this.checkGroupNameUniqueUC.execute(req.params.name);
    res.json({ isUnique });
  });

  sendJoinRequest = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.sendJoinRequestUC.execute(req.params.id, req.body);
    res.status(200).json(result);
  });

  getGroupRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await this.getGroupRequestsUC.execute(req.params.id);
    res.status(200).json(requests);
  });

  handleRequestAction = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.handleRequestActionUC.execute(req.params.id, req.params.requestId, req.body.status);
    res.status(200).json(result);
  });

  removeMember = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.removeMemberUC.execute(req.params.id, req.params.userId, req.query.adminId as string);
    res.json(result);
  });

  transferAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { adminId, newAdminId } = req.body;
    await this.transferAdminUC.execute(req.params.id, adminId, newAdminId);
    res.status(200).json({ message: "Administración cedida con éxito." });
  });

  requestAdminTransfer = asyncHandler(async (req: Request, res: Response) => {
    const { adminId, candidateId } = req.body;
    const result = await this.requestAdminTransferUC.execute(req.params.id, adminId, candidateId);
    res.status(200).json(result);
  });

  handleAdminTransferResponse = asyncHandler(async (req: Request, res: Response) => {
    const { candidateId, action } = req.body;
    const result = await this.handleAdminTransferResponseUC.execute(req.params.id, candidateId, action);
    res.status(200).json(result);
  });

  addMember = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.addMemberUC.execute(req.params.id, req.body);
    res.status(201).json(result);
  });

  leaveGroup = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.leaveGroupUC.execute(req.params.id, req.params.userId);
    res.json(result);
  });

  deleteUserRequests = asyncHandler(async (req: Request, res: Response) => {
    const { id, userId } = req.params;
    const result = await this.deleteUserRequestsUC.execute(id, userId);
    res.status(200).json(result);
  });

  getAvailableStudents = asyncHandler(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const students = await this.getAvailableStudentsUC.execute(groupId);
    res.status(200).json(students);
  });

  static getInstance(useCases: any) {
    if (!GroupController.instance) {
      GroupController.instance = new GroupController(useCases);
    } 
    return GroupController.instance;
  }
}
export default GroupController;
