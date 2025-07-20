import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LandOwner } from "./land-owner.entity";
import { Dispute } from "./dispute.entity";
import { ConstructionPermit } from "./construction-permit.entity";

export enum UserRole {
  CITIZEN = 'citizen',
  ADMIN = 'admin',
  TAX_OFFICER = 'tax_officer',
  URBAN_PLANNER = 'urban_planner',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  nationalId: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => LandOwner, (owner) => owner.user)
  ownedLands: LandOwner[];

  @OneToMany(() => Dispute, (dispute) => dispute.reporter)
  disputesReported: Dispute[];

  @OneToMany(() => ConstructionPermit, (permit) => permit.applicant)
  permits: ConstructionPermit[];
}
