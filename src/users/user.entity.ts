
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRecover, AfterUpdate } from "typeorm";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @AfterInsert()
    logInsert(){
        console.log("User inserted", this.id);
    }
    @AfterRecover()
    logRemove(){
        console.log('removed user with id', this.id);
        
    }
    @AfterUpdate()
    logUpdate(){
        console.log('updated user iwth id', this.id);
        
    }
}