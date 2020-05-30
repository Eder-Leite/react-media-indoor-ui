function User() {
    this.id = undefined;
    this.name = undefined;
    this.email = undefined;
    this.password = undefined;
    this.type = undefined;
    this.status = undefined;
    this.updated_at = undefined;
    this.created_at = undefined;
}

export const SchemaUser = User;

function UserProfile() {
    this.id = undefined;
    this.name = undefined;
    this.email = undefined;
    this.password = undefined;
    this.newPassword = undefined;
    this.type = undefined;
    this.status = undefined;
    this.updated_at = undefined;
    this.created_at = undefined;
}

export const SchemaUserProfile = UserProfile;

function Group() {
    this.id = undefined;
    this.user_id = undefined;
    this.description = undefined;
    this.updated_at = undefined;
    this.created_at = undefined;
}

export const SchemaGroup = Group;

function Pleace() {
    this.id = undefined;
    this.user_id = undefined;
    this.group_id = undefined;
    this.updated_at = undefined;
    this.created_at = undefined;
}

export const SchemaPleace = Pleace;

function Media() {
    this.id = undefined;
    this.user_id = undefined;
    this.type = 'FORESCAT';
    this.title = undefined;
    this.city = undefined;
    this.directory = undefined;
    this.duration = 60;
    this.updated_at = undefined;
    this.created_at = undefined;
}

export const SchemaMedia = Media;

function Publication() {
    this.id = undefined;
    this.ordination = undefined;
    this.group_id = undefined;
    this.user_id = undefined;
    this.media_id = undefined;
    this.title = undefined;
}

export const SchemaPublication = Publication;

function TypePublication() {
    this.id = undefined;
    this.group_id = undefined;
    this.user_id = undefined;
    this.description = undefined;
}

export const SchemaTypePublication = TypePublication;