import { Injectable } from "@nestjs/common";
import { CreateAssiggnedTreePlantDto } from "./dtos";
import { AssignedTreePlant } from "./schemas";
import { AssignedTreePlantRepository } from "./assignedTreePlant.repository";
import {
  getPlanterData,
  getPlanterOrganization,
  getSigner,
  getTreeData,
} from "src/common/helpers";
import { UserService } from "./../user/user.service";
var ethUtil = require("ethereumjs-util");
@Injectable()
export class AssignedTreePlantService {
  constructor(
    private assignedTreePlantRepository: AssignedTreePlantRepository,
    private userService: UserService
  ) {}

  async create(dto: CreateAssiggnedTreePlantDto) {
    let tree = await getTreeData(dto.treeId);

    let user = await this.userService.findUserByWallet(dto.signer);

    if (!user) return "not-found user";

    const signer = await getSigner(dto.signature, {
      nonce: user.plantingNonce,
      treeId: dto.treeId,
      treeSpecs: dto.treeSpecs,
      birthDate: dto.birthDate,
      countryCode: dto.countryCode,
    });

    if (
      ethUtil.toChecksumAddress(signer) !==
      ethUtil.toChecksumAddress(dto.signer)
    )
      return "invalid signer";

    if (tree.treeStatus != 2) return "invalid-tree status";
    console.log("tre", tree);
    let pendingPlants = await this.getSignedMessagesList({
      signer: dto.signer,
      isExecuted: false,
    });

    const planterData = await getPlanterData(signer);

    console.log("planterDa", planterData);

    if (planterData.status != 1) return "invalid planter";
    console.log("signer", signer);
    console.log("tree.planter", tree.planter);

    if (
      ethUtil.toChecksumAddress(tree.planter) !==
      ethUtil.toChecksumAddress(signer)
    ) {
      if (planterData.planterType != 3) return "invlid planter data";

      if (tree.planter != (await getPlanterOrganization(signer)))
        return "planter org invalid";
    }

    if (
      planterData.plantedCount + pendingPlants.length >=
      planterData.supplyCap
    )
      return "supply error";

    await this.userService.updateUserById(user._id, {
      plantingNonce: user.plantingNonce + 1,
    });

    return await this.assignedTreePlantRepository.create({ ...dto });
  }

  async getSignedMessagesList(filter) {
    return await this.assignedTreePlantRepository.find(filter);
  }
}
