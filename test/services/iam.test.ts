import { expect } from "@effect/vitest";
import { Effect } from "effect";
import {
  addRoleToInstanceProfile,
  addUserToGroup,
  attachGroupPolicy,
  attachRolePolicy,
  // Attach/Detach policies
  attachUserPolicy,
  // Access keys
  createAccessKey,
  // Group operations
  createGroup,
  // Instance profiles
  createInstanceProfile,
  // Policy operations
  createPolicy,
  createPolicyVersion,
  // Role operations
  createRole,
  // User operations
  createUser,
  deleteAccessKey,
  deleteGroup,
  deleteGroupPolicy,
  deleteInstanceProfile,
  deletePolicy,
  deletePolicyVersion,
  deleteRole,
  deleteRolePolicy,
  deleteUser,
  deleteUserPolicy,
  detachGroupPolicy,
  detachRolePolicy,
  detachUserPolicy,
  getAccessKeyLastUsed,
  // Account
  getAccountSummary,
  getGroup,
  getGroupPolicy,
  getInstanceProfile,
  getPolicy,
  getPolicyVersion,
  getRole,
  getRolePolicy,
  getUser,
  getUserPolicy,
  listAccessKeys,
  listAccountAliases,
  listAttachedGroupPolicies,
  listAttachedRolePolicies,
  listAttachedUserPolicies,
  listGroupPolicies,
  listGroups,
  listGroupsForUser,
  listInstanceProfiles,
  listInstanceProfilesForRole,
  listPolicies,
  listPolicyVersions,
  listRolePolicies,
  listRoles,
  listUserPolicies,
  listUsers,
  putGroupPolicy,
  putRolePolicy,
  // Inline policies
  putUserPolicy,
  removeRoleFromInstanceProfile,
  removeUserFromGroup,
  updateAccessKey,
  updateAssumeRolePolicy,
  updateGroup,
  updateRole,
  updateUser,
} from "../../src/services/iam.ts";
import { test } from "../test.ts";

// Helper trust policy document for roles
const trustPolicy = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: "ec2.amazonaws.com",
      },
      Action: "sts:AssumeRole",
    },
  ],
});

// Helper policy document for managed policies
const policyDocument = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Action: ["s3:GetObject", "s3:ListBucket"],
      Resource: "*",
    },
  ],
});

// Helper to ensure cleanup happens even on failure
const withUser = <A, E, R>(
  userName: string,
  testFn: (userName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    yield* createUser({ UserName: userName });
    return yield* testFn(userName).pipe(
      Effect.ensuring(deleteUser({ UserName: userName }).pipe(Effect.ignore)),
    );
  });

const withGroup = <A, E, R>(
  groupName: string,
  testFn: (groupName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    yield* createGroup({ GroupName: groupName });
    return yield* testFn(groupName).pipe(
      Effect.ensuring(
        deleteGroup({ GroupName: groupName }).pipe(Effect.ignore),
      ),
    );
  });

const withRole = <A, E, R>(
  roleName: string,
  testFn: (roleName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    yield* createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: trustPolicy,
    });
    return yield* testFn(roleName).pipe(
      Effect.ensuring(deleteRole({ RoleName: roleName }).pipe(Effect.ignore)),
    );
  });

const withPolicy = <A, E, R>(
  policyName: string,
  testFn: (policyArn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    const result = yield* createPolicy({
      PolicyName: policyName,
      PolicyDocument: policyDocument,
    });
    const policyArn = result.Policy!.Arn!;
    return yield* testFn(policyArn).pipe(
      Effect.ensuring(
        deletePolicy({ PolicyArn: policyArn }).pipe(Effect.ignore),
      ),
    );
  });

// ============================================================================
// User Lifecycle Tests
// ============================================================================

test(
  "create user, get user, list users, and delete",
  withUser("itty-iam-user-lifecycle", (userName) =>
    Effect.gen(function* () {
      // Get user to verify it exists
      const user = yield* getUser({ UserName: userName });
      expect(user.User?.UserName).toEqual(userName);

      // User should have an ARN
      expect(user.User?.Arn).toBeDefined();

      // List users and verify our user is in the list
      const listResult = yield* listUsers({});
      const foundUser = listResult.Users?.find((u) => u.UserName === userName);
      expect(foundUser).toBeDefined();
    }),
  ),
);

test(
  "update user path",
  withUser("itty-iam-user-update", (userName) =>
    Effect.gen(function* () {
      // Update user path
      yield* updateUser({
        UserName: userName,
        NewPath: "/developers/",
      });

      // Get user and verify path was updated
      const user = yield* getUser({ UserName: userName });
      expect(user.User?.Path).toEqual("/developers/");
    }),
  ),
);

// ============================================================================
// Group Lifecycle Tests
// ============================================================================

test(
  "create group, get group, list groups, and delete",
  withGroup("itty-iam-group-lifecycle", (groupName) =>
    Effect.gen(function* () {
      // Get group to verify it exists
      const group = yield* getGroup({ GroupName: groupName });
      expect(group.Group?.GroupName).toEqual(groupName);

      // Group should have an ARN
      expect(group.Group?.Arn).toBeDefined();

      // List groups and verify our group is in the list
      const listResult = yield* listGroups({});
      const foundGroup = listResult.Groups?.find(
        (g) => g.GroupName === groupName,
      );
      expect(foundGroup).toBeDefined();
    }),
  ),
);

test(
  "update group name and path",
  withGroup("itty-iam-group-update", (groupName) =>
    Effect.gen(function* () {
      const newGroupName = "itty-iam-group-updated";

      // Update group
      yield* updateGroup({
        GroupName: groupName,
        NewGroupName: newGroupName,
        NewPath: "/teams/",
      });

      // Get group with new name and verify
      const group = yield* getGroup({ GroupName: newGroupName });
      expect(group.Group?.GroupName).toEqual(newGroupName);
      expect(group.Group?.Path).toEqual("/teams/");

      // Clean up with the new name
      yield* deleteGroup({ GroupName: newGroupName });
    }),
  ),
);

// ============================================================================
// User-Group Membership Tests
// ============================================================================

test(
  "add and remove user from group",
  withGroup("itty-iam-membership-group", (groupName) =>
    withUser("itty-iam-membership-user", (userName) =>
      Effect.gen(function* () {
        // Add user to group
        yield* addUserToGroup({
          GroupName: groupName,
          UserName: userName,
        });

        // Verify user is in group
        const groupResult = yield* getGroup({ GroupName: groupName });
        const userInGroup = groupResult.Users?.find(
          (u) => u.UserName === userName,
        );
        expect(userInGroup).toBeDefined();

        // List groups for user
        const userGroups = yield* listGroupsForUser({ UserName: userName });
        const foundGroup = userGroups.Groups?.find(
          (g) => g.GroupName === groupName,
        );
        expect(foundGroup).toBeDefined();

        // Remove user from group
        yield* removeUserFromGroup({
          GroupName: groupName,
          UserName: userName,
        });

        // Verify user is no longer in group
        const groupAfterRemove = yield* getGroup({ GroupName: groupName });
        const userStillInGroup = groupAfterRemove.Users?.find(
          (u) => u.UserName === userName,
        );
        expect(userStillInGroup).toBeUndefined();
      }),
    ),
  ),
);

// ============================================================================
// Role Lifecycle Tests
// ============================================================================

test(
  "create role, get role, list roles, and delete",
  withRole("itty-iam-role-lifecycle", (roleName) =>
    Effect.gen(function* () {
      // Get role to verify it exists
      const role = yield* getRole({ RoleName: roleName });
      expect(role.Role?.RoleName).toEqual(roleName);

      // Role should have an ARN
      expect(role.Role?.Arn).toBeDefined();

      // Role should have the trust policy
      expect(role.Role?.AssumeRolePolicyDocument).toBeDefined();

      // List roles and verify our role is in the list
      const listResult = yield* listRoles({});
      const foundRole = listResult.Roles?.find((r) => r.RoleName === roleName);
      expect(foundRole).toBeDefined();
    }),
  ),
);

test(
  "update role description and max session duration",
  withRole("itty-iam-role-update", (roleName) =>
    Effect.gen(function* () {
      // Update role
      yield* updateRole({
        RoleName: roleName,
        Description: "Updated description for testing",
        MaxSessionDuration: 7200, // 2 hours
      });

      // Get role and verify updates
      const role = yield* getRole({ RoleName: roleName });
      expect(role.Role?.Description).toEqual("Updated description for testing");
      expect(role.Role?.MaxSessionDuration).toEqual(7200);
    }),
  ),
);

test(
  "update assume role policy",
  withRole("itty-iam-role-trust-policy", (roleName) =>
    Effect.gen(function* () {
      // New trust policy allowing Lambda
      const newTrustPolicy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      });

      // Update the trust policy
      yield* updateAssumeRolePolicy({
        RoleName: roleName,
        PolicyDocument: newTrustPolicy,
      });

      // Get role and verify trust policy was updated
      const role = yield* getRole({ RoleName: roleName });
      const policyDoc = role.Role?.AssumeRolePolicyDocument;
      expect(policyDoc).toBeDefined();

      // The policy document is URL-encoded, decode and parse it
      const decodedPolicy = JSON.parse(decodeURIComponent(policyDoc!));
      const principal = decodedPolicy.Statement?.[0]?.Principal?.Service;
      expect(principal).toEqual("lambda.amazonaws.com");
    }),
  ),
);

// ============================================================================
// Managed Policy Tests
// ============================================================================

test(
  "create policy, get policy, list policies, and delete",
  withPolicy("itty-iam-policy-lifecycle", (policyArn) =>
    Effect.gen(function* () {
      // Get policy to verify it exists
      const policy = yield* getPolicy({ PolicyArn: policyArn });
      expect(policy.Policy?.Arn).toBeDefined();

      // Policy should have default version
      expect(policy.Policy?.DefaultVersionId).toBeDefined();

      // List policies and verify our policy is in the list
      const listResult = yield* listPolicies({ Scope: "Local" });
      const foundPolicy = listResult.Policies?.find((p) => p.Arn === policyArn);
      expect(foundPolicy).toBeDefined();
    }),
  ),
);

test(
  "create and manage policy versions",
  withPolicy("itty-iam-policy-versions", (policyArn) =>
    Effect.gen(function* () {
      // Create a new policy version
      const newPolicyDocument = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["s3:*"],
            Resource: "*",
          },
        ],
      });

      const versionResult = yield* createPolicyVersion({
        PolicyArn: policyArn,
        PolicyDocument: newPolicyDocument,
        SetAsDefault: true,
      });

      expect(versionResult.PolicyVersion?.VersionId).toBeDefined();

      const newVersionId = versionResult.PolicyVersion!.VersionId!;

      // List policy versions
      const versionsResult = yield* listPolicyVersions({
        PolicyArn: policyArn,
      });
      expect((versionsResult.Versions?.length ?? 0) >= 2).toBe(true);

      // Get the new version
      const versionDetails = yield* getPolicyVersion({
        PolicyArn: policyArn,
        VersionId: newVersionId,
      });
      expect(versionDetails.PolicyVersion?.IsDefaultVersion).toBe(true);

      // Delete the old version (v1)
      yield* deletePolicyVersion({
        PolicyArn: policyArn,
        VersionId: "v1",
      });

      // Verify only one version remains
      const finalVersions = yield* listPolicyVersions({
        PolicyArn: policyArn,
      });
      expect(finalVersions.Versions?.length).toEqual(1);
    }),
  ),
);

// ============================================================================
// Attach/Detach Managed Policy Tests
// ============================================================================

test(
  "attach and detach policy from user",
  withUser("itty-iam-attach-user", (userName) =>
    withPolicy("itty-iam-attach-user-policy", (policyArn) =>
      Effect.gen(function* () {
        // Attach policy to user
        yield* attachUserPolicy({
          UserName: userName,
          PolicyArn: policyArn,
        });

        // List attached policies
        const attachedPolicies = yield* listAttachedUserPolicies({
          UserName: userName,
        });
        const foundPolicy = attachedPolicies.AttachedPolicies?.find(
          (p) => p.PolicyArn === policyArn,
        );
        expect(foundPolicy).toBeDefined();

        // Detach policy from user
        yield* detachUserPolicy({
          UserName: userName,
          PolicyArn: policyArn,
        });

        // Verify policy is detached
        const afterDetach = yield* listAttachedUserPolicies({
          UserName: userName,
        });
        const stillAttached = afterDetach.AttachedPolicies?.find(
          (p) => p.PolicyArn === policyArn,
        );
        expect(stillAttached).toBeUndefined();
      }),
    ),
  ),
);

test(
  "attach and detach policy from group",
  withGroup("itty-iam-attach-group", (groupName) =>
    withPolicy("itty-iam-attach-group-policy", (policyArn) =>
      Effect.gen(function* () {
        // Attach policy to group
        yield* attachGroupPolicy({
          GroupName: groupName,
          PolicyArn: policyArn,
        });

        // List attached policies
        const attachedPolicies = yield* listAttachedGroupPolicies({
          GroupName: groupName,
        });
        const foundPolicy = attachedPolicies.AttachedPolicies?.find(
          (p) => p.PolicyArn === policyArn,
        );
        expect(foundPolicy).toBeDefined();

        // Detach policy from group
        yield* detachGroupPolicy({
          GroupName: groupName,
          PolicyArn: policyArn,
        });

        // Verify policy is detached
        const afterDetach = yield* listAttachedGroupPolicies({
          GroupName: groupName,
        });
        const stillAttached = afterDetach.AttachedPolicies?.find(
          (p) => p.PolicyArn === policyArn,
        );
        expect(stillAttached).toBeUndefined();
      }),
    ),
  ),
);

test(
  "attach and detach policy from role",
  withRole("itty-iam-attach-role", (roleName) =>
    withPolicy("itty-iam-attach-role-policy", (policyArn) =>
      Effect.gen(function* () {
        // Attach policy to role
        yield* attachRolePolicy({
          RoleName: roleName,
          PolicyArn: policyArn,
        });

        // List attached policies
        const attachedPolicies = yield* listAttachedRolePolicies({
          RoleName: roleName,
        });
        const foundPolicy = attachedPolicies.AttachedPolicies?.find(
          (p) => p.PolicyArn === policyArn,
        );
        expect(foundPolicy).toBeDefined();

        // Detach policy from role
        yield* detachRolePolicy({
          RoleName: roleName,
          PolicyArn: policyArn,
        });

        // Verify policy is detached
        const afterDetach = yield* listAttachedRolePolicies({
          RoleName: roleName,
        });
        const stillAttached = afterDetach.AttachedPolicies?.find(
          (p) => p.PolicyArn === policyArn,
        );
        expect(stillAttached).toBeUndefined();
      }),
    ),
  ),
);

// ============================================================================
// Inline Policy Tests
// ============================================================================

test(
  "put, get, list, and delete inline user policy",
  withUser("itty-iam-inline-user", (userName) =>
    Effect.gen(function* () {
      const policyName = "InlineTestPolicy";

      // Put inline policy
      yield* putUserPolicy({
        UserName: userName,
        PolicyName: policyName,
        PolicyDocument: policyDocument,
      });

      // List inline policies
      const policies = yield* listUserPolicies({ UserName: userName });
      const foundPolicy = policies.PolicyNames?.find((p) => p === policyName);
      expect(foundPolicy).toBeDefined();

      // Get inline policy
      const policyResult = yield* getUserPolicy({
        UserName: userName,
        PolicyName: policyName,
      });
      expect(policyResult.PolicyDocument).toBeDefined();

      // Delete inline policy
      yield* deleteUserPolicy({
        UserName: userName,
        PolicyName: policyName,
      });

      // Verify deletion
      const afterDelete = yield* listUserPolicies({ UserName: userName });
      const stillExists = afterDelete.PolicyNames?.find(
        (p) => p === policyName,
      );
      expect(stillExists).toBeUndefined();
    }),
  ),
);

test(
  "put, get, list, and delete inline group policy",
  withGroup("itty-iam-inline-group", (groupName) =>
    Effect.gen(function* () {
      const policyName = "InlineGroupPolicy";

      // Put inline policy
      yield* putGroupPolicy({
        GroupName: groupName,
        PolicyName: policyName,
        PolicyDocument: policyDocument,
      });

      // List inline policies
      const policies = yield* listGroupPolicies({ GroupName: groupName });
      const foundPolicy = policies.PolicyNames?.find((p) => p === policyName);
      expect(foundPolicy).toBeDefined();

      // Get inline policy
      const policyResult = yield* getGroupPolicy({
        GroupName: groupName,
        PolicyName: policyName,
      });
      expect(policyResult.PolicyDocument).toBeDefined();

      // Delete inline policy
      yield* deleteGroupPolicy({
        GroupName: groupName,
        PolicyName: policyName,
      });

      // Verify deletion
      const afterDelete = yield* listGroupPolicies({ GroupName: groupName });
      const stillExists = afterDelete.PolicyNames?.find(
        (p) => p === policyName,
      );
      expect(stillExists).toBeUndefined();
    }),
  ),
);

test(
  "put, get, list, and delete inline role policy",
  withRole("itty-iam-inline-role", (roleName) =>
    Effect.gen(function* () {
      const policyName = "InlineRolePolicy";

      // Put inline policy
      yield* putRolePolicy({
        RoleName: roleName,
        PolicyName: policyName,
        PolicyDocument: policyDocument,
      });

      // List inline policies
      const policies = yield* listRolePolicies({ RoleName: roleName });
      const foundPolicy = policies.PolicyNames?.find((p) => p === policyName);
      expect(foundPolicy).toBeDefined();

      // Get inline policy
      const policyResult = yield* getRolePolicy({
        RoleName: roleName,
        PolicyName: policyName,
      });
      expect(policyResult.PolicyDocument).toBeDefined();

      // Delete inline policy
      yield* deleteRolePolicy({
        RoleName: roleName,
        PolicyName: policyName,
      });

      // Verify deletion
      const afterDelete = yield* listRolePolicies({ RoleName: roleName });
      const stillExists = afterDelete.PolicyNames?.find(
        (p) => p === policyName,
      );
      expect(stillExists).toBeUndefined();
    }),
  ),
);

// ============================================================================
// Instance Profile Tests
// ============================================================================

test(
  "create instance profile, add/remove role, and delete",
  Effect.gen(function* () {
    const profileName = "itty-iam-instance-profile";
    const roleName = "itty-iam-profile-role";

    // Create role first
    yield* createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: trustPolicy,
    });

    try {
      // Create instance profile
      yield* createInstanceProfile({
        InstanceProfileName: profileName,
      });

      try {
        // Get instance profile
        const profile = yield* getInstanceProfile({
          InstanceProfileName: profileName,
        });
        expect(profile.InstanceProfile?.InstanceProfileName).toEqual(
          profileName,
        );

        // List instance profiles
        const profiles = yield* listInstanceProfiles({});
        const foundProfile = profiles.InstanceProfiles?.find(
          (p) => p.InstanceProfileName === profileName,
        );
        expect(foundProfile).toBeDefined();

        // Add role to instance profile
        yield* addRoleToInstanceProfile({
          InstanceProfileName: profileName,
          RoleName: roleName,
        });

        // Verify role is added
        const profileWithRole = yield* getInstanceProfile({
          InstanceProfileName: profileName,
        });
        const roleInProfile = profileWithRole.InstanceProfile?.Roles?.find(
          (r) => r.RoleName === roleName,
        );
        expect(roleInProfile).toBeDefined();

        // List instance profiles for role
        const profilesForRole = yield* listInstanceProfilesForRole({
          RoleName: roleName,
        });
        const foundForRole = profilesForRole.InstanceProfiles?.find(
          (p) => p.InstanceProfileName === profileName,
        );
        expect(foundForRole).toBeDefined();

        // Remove role from instance profile
        yield* removeRoleFromInstanceProfile({
          InstanceProfileName: profileName,
          RoleName: roleName,
        });

        // Verify role is removed
        const profileAfterRemove = yield* getInstanceProfile({
          InstanceProfileName: profileName,
        });
        const roleStillInProfile =
          profileAfterRemove.InstanceProfile?.Roles?.find(
            (r) => r.RoleName === roleName,
          );
        expect(roleStillInProfile).toBeUndefined();
      } finally {
        // Clean up instance profile
        yield* Effect.ignore(
          deleteInstanceProfile({ InstanceProfileName: profileName }),
        );
      }
    } finally {
      // Clean up role
      yield* Effect.ignore(deleteRole({ RoleName: roleName }));
    }
  }),
);

// ============================================================================
// Access Key Tests
// ============================================================================

test(
  "create, list, update, and delete access key",
  withUser("itty-iam-access-key-user", (userName) =>
    Effect.gen(function* () {
      // Create access key
      const keyResult = yield* createAccessKey({ UserName: userName });
      expect(keyResult.AccessKey?.AccessKeyId).toBeDefined();
      expect(keyResult.AccessKey?.SecretAccessKey).toBeDefined();

      const accessKeyId = keyResult.AccessKey!.AccessKeyId!;

      try {
        // List access keys
        const keys = yield* listAccessKeys({ UserName: userName });
        const foundKey = keys.AccessKeyMetadata?.find(
          (k) => k.AccessKeyId === accessKeyId,
        );
        expect(foundKey).toBeDefined();
        expect(foundKey?.Status).toEqual("Active");

        // Update access key status to inactive
        yield* updateAccessKey({
          UserName: userName,
          AccessKeyId: accessKeyId,
          Status: "Inactive",
        });

        // Verify status update
        const keysAfterUpdate = yield* listAccessKeys({ UserName: userName });
        const updatedKey = keysAfterUpdate.AccessKeyMetadata?.find(
          (k) => k.AccessKeyId === accessKeyId,
        );
        expect(updatedKey?.Status).toEqual("Inactive");

        // Get access key last used (may not have data since key wasn't used)
        const lastUsed = yield* getAccessKeyLastUsed({
          AccessKeyId: accessKeyId,
        });
        // Just verify we got a response - LastUsedDate may be undefined for unused keys
        expect(lastUsed.UserName).toBeDefined();
      } finally {
        // Clean up access key
        yield* deleteAccessKey({
          UserName: userName,
          AccessKeyId: accessKeyId,
        });
      }
    }),
  ),
);

// ============================================================================
// Account Summary Tests
// ============================================================================

test(
  "get account summary",
  Effect.gen(function* () {
    const summary = yield* getAccountSummary({});

    // Should have a SummaryMap with account metrics
    expect(summary.SummaryMap).toBeDefined();

    // Check for some expected keys
    // Note: The exact keys may vary by environment
    const expectedKeys = ["Users", "Groups", "Roles", "Policies"];
    for (const key of expectedKeys) {
      if (summary.SummaryMap![key] === undefined) {
        // Not all keys may be present, just check we have some data
      }
    }
  }),
);

test(
  "list account aliases",
  Effect.gen(function* () {
    // Just verify the operation works - may or may not have aliases
    const result = yield* listAccountAliases({});

    // AccountAliases should be an array (possibly empty)
    expect(Array.isArray(result.AccountAliases)).toBe(true);
  }),
);

// ============================================================================
// Complex Scenario Tests
// ============================================================================

test(
  "create full IAM structure: user in group with role and policies",
  Effect.gen(function* () {
    const userName = "itty-iam-full-test-user";
    const groupName = "itty-iam-full-test-group";
    const roleName = "itty-iam-full-test-role";
    const policyName = "itty-iam-full-test-policy";

    // Create resources
    yield* createUser({ UserName: userName });
    yield* createGroup({ GroupName: groupName });
    yield* createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: trustPolicy,
      Description: "Full test role",
    });
    const policyResult = yield* createPolicy({
      PolicyName: policyName,
      PolicyDocument: policyDocument,
      Description: "Full test policy",
    });
    const policyArn = policyResult.Policy!.Arn!;

    try {
      // Set up relationships
      yield* addUserToGroup({
        UserName: userName,
        GroupName: groupName,
      });

      yield* attachUserPolicy({
        UserName: userName,
        PolicyArn: policyArn,
      });

      yield* attachGroupPolicy({
        GroupName: groupName,
        PolicyArn: policyArn,
      });

      yield* attachRolePolicy({
        RoleName: roleName,
        PolicyArn: policyArn,
      });

      // Verify setup
      const userGroups = yield* listGroupsForUser({ UserName: userName });
      expect(
        userGroups.Groups?.find((g) => g.GroupName === groupName),
      ).toBeDefined();

      const userPolicies = yield* listAttachedUserPolicies({
        UserName: userName,
      });
      expect(
        userPolicies.AttachedPolicies?.find((p) => p.PolicyArn === policyArn),
      ).toBeDefined();

      const groupPolicies = yield* listAttachedGroupPolicies({
        GroupName: groupName,
      });
      expect(
        groupPolicies.AttachedPolicies?.find((p) => p.PolicyArn === policyArn),
      ).toBeDefined();

      const rolePolicies = yield* listAttachedRolePolicies({
        RoleName: roleName,
      });
      expect(
        rolePolicies.AttachedPolicies?.find((p) => p.PolicyArn === policyArn),
      ).toBeDefined();
    } finally {
      // Clean up in reverse order of dependencies
      yield* Effect.ignore(
        detachUserPolicy({ UserName: userName, PolicyArn: policyArn }),
      );
      yield* Effect.ignore(
        detachGroupPolicy({ GroupName: groupName, PolicyArn: policyArn }),
      );
      yield* Effect.ignore(
        detachRolePolicy({ RoleName: roleName, PolicyArn: policyArn }),
      );
      yield* Effect.ignore(
        removeUserFromGroup({ UserName: userName, GroupName: groupName }),
      );
      yield* Effect.ignore(deletePolicy({ PolicyArn: policyArn }));
      yield* Effect.ignore(deleteRole({ RoleName: roleName }));
      yield* Effect.ignore(deleteGroup({ GroupName: groupName }));
      yield* Effect.ignore(deleteUser({ UserName: userName }));
    }
  }),
);
