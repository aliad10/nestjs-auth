import { Controller, Get, Body, Post } from "@nestjs/common";
import { Request } from "express";
import { AssignedTreePlantService } from "./assignedTreePlant.service";
@Controller("assignedTreePlant")
export class AssignedTreePlantController {
  constructor(private assignedTreePlantService: AssignedTreePlantService) {}

  @Post("me")
  GetMe(@Body() body) {
    return this.assignedTreePlantService.create(body);
  }
}
