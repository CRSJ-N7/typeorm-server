import * as typeorm from 'typeorm';

@typeorm.Entity()
class TodoItem {
  @typeorm.PrimaryGeneratedColumn()
  id: number;

  @typeorm.Column({ type: 'varchar', unique: false, nullable: false })
  title: string;

  @typeorm.Column({ type: 'boolean', unique: false, nullable: false })
  isCompleted: boolean;
}

export default TodoItem;
