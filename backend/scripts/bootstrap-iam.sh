#!/bin/bash

POLICY_NAME="CloudFormationAccessForServerless"
POLICY_FILE="policies/CloudFormationAccessForServerless.json"

# Get current AWS username and account ID
USER_NAME=$(aws iam get-user --query 'User.UserName' --output text 2>/dev/null)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [[ -z "$USER_NAME" ]]; then
  echo "❌ Could not get IAM user. Are you using assumed roles or temporary credentials?"
  exit 1
fi

echo "🧩 Creating policy '$POLICY_NAME'..."

aws iam create-policy \
  --policy-name "$POLICY_NAME" \
  --policy-document "file://$POLICY_FILE" \
  2>/dev/null || echo "ℹ️ Policy already exists — continuing."

echo "🔗 Attaching policy to user '$USER_NAME'..."

aws iam attach-user-policy \
  --user-name "$USER_NAME" \
  --policy-arn "arn:aws:iam::$ACCOUNT_ID:policy/$POLICY_NAME"

echo "✅ Bootstrap complete for user: $USER_NAME"
